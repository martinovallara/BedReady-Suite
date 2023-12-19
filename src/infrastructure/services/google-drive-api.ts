
import fs from 'fs/promises'
import path from 'path'
import process from 'process'
import { authenticate } from '@google-cloud/local-auth'
import { drive_v3, google } from 'googleapis';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth.js'
import { OAuth2Client } from 'google-auth-library'

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.file',
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH: string = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

export const fileName = (): string => { 
  // read from env variable by dotenv
  const fileName = process.env.EVENTS_STORAGE_FILE_NAME;
  if (fileName === undefined) {
    throw new Error("EVENTS_STORAGE_FILE_NAME env variable not set")
  }
  return fileName;
};
const folderId = '1NdiocoeYAudPCGvf5icMNryXQ7-222K3';

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    //console.log("TOKEN_PATH: ", TOKEN_PATH)
    const content = await fs.readFile(TOKEN_PATH);

    const credentials = JSON.parse(content.toString());
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  //console.log("============= OAuth2Client =============")
  let client: JSONClient | OAuth2Client | null = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client?.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client: JSONClient | OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content.toString());
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}


async function getFileIdFromFilename(drive: drive_v3.Drive,
  fileName: string,
  folderId: string): Promise<string | undefined | null> {

  //const drive = google.drive({ version: 'v3', auth: authClient as OAuth2Client });
  const fileList = await drive.files.list({
    q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
    spaces: 'drive',
    fields: 'files(id, name)'
  });

  return (fileList.data.files as drive_v3.Schema$File[])[0]?.id;
}

async function readToDrive(drive: drive_v3.Drive, fileId: string) {
  const response = await drive.files.get({
    fileId: fileId,
    alt: 'media',
  }, { responseType: 'json' });
  return response.data
}


async function createOrUpdateFile(drive: drive_v3.Drive,
  fileName: string,
  folderId: string, content: string) {

  const fileMetadata = {
    name: fileName,
    parents: [folderId]
  };
  const media = {
    mimeType: 'text/plain',
    body: content
  };

  try {
    // Check if the file exists
    const existingFileId = await getFileIdFromFilename(drive, fileName, folderId);
    let file;
    if (existingFileId === undefined || existingFileId === null) {
      // File does not exist, create new file
      file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
      });
      //console.log('File created, ID:', file.data.id);
    } else {
      // File exists, update existing file
      file = await drive.files.update({
        fileId: existingFileId,
        media: media
      });
      //console.log('File updated, ID:', existingFileId);
      //console.log('content:', JSON.stringify(file.config.data, null, 2));
    }

    return file.data.id;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}



export async function persistToDrive(jsonData: string) {
  await authorize().then((client) => {
    const drive = google.drive({ version: 'v3', auth: client as OAuth2Client });
    createOrUpdateFile(drive, fileName(), folderId, jsonData);
  }).catch(console.error);
}



export async function readStorageFromDrive() {
  try {
    console.log("readStorageFromDrive from:  ", fileName())
    const client = await authorize()
    const drive = google.drive({ version: 'v3', auth: client as OAuth2Client });
    const fileId = await getFileIdFromFilename(drive, fileName(), folderId);
    if (fileId !== undefined && fileId !== null) {
      const fileContent = await readToDrive(drive, fileId) as string;
      return JSON.stringify(fileContent);
    }
    return undefined;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

