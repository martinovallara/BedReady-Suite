
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


/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
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
  console.log("============= OAuth2Client =============")
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


async function createOrUpdateFile(authClient: JSONClient | OAuth2Client, 
                                  fileName: string, 
                                  folderId: string, content: string) {
  const drive = google.drive({ version: 'v3', auth: authClient as OAuth2Client });
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
    const fileList = await drive.files.list({
      q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
      spaces: 'drive',
      fields: 'files(id, name)'
    });

    let file;
    if (fileList.data.files?.length === 0) {
      // File does not exist, create new file
      file = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id'
      });
      console.log('File created, ID:', file.data.id);
    } else {
      // File exists, update existing file
      const existingFileId = (fileList.data.files as drive_v3.Schema$File[])[0].id;
      file = await drive.files.update({
        fileId: existingFileId as string,
        media: media
      });
      console.log('File updated, ID:', existingFileId);
      console.log('content:', JSON.stringify(file.config.data, null, 2));
    }

    return file.data.id;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}


export function persistToDrive(jsonData: string) {
  authorize().then((client) => {
    const folderId = '1NdiocoeYAudPCGvf5icMNryXQ7-222K3';
    const fileName = 'events-storage-test.txt';
    createOrUpdateFile(client as OAuth2Client, fileName, folderId, jsonData);
  }).catch(console.error);
}

