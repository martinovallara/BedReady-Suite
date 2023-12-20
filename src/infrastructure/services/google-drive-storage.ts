
import { OAuth2Client } from 'google-auth-library';
import * as Drive from '@googleapis/drive';

import { getJsonResponseCache, setJsonResponseCache } from '../../utils/string-cache.js';
import authorize from '../../libs/google-drive-authenticate.js';
import googleDriveApis from '../../libs/google-drive-apis.js';

const folderId = '1NdiocoeYAudPCGvf5icMNryXQ7-222K3';
const fileName = (): string => { 
  // read from env variable by dotenv
  const fileName = process.env.EVENTS_STORAGE_FILE_NAME;
  if (fileName === undefined) {
    throw new Error("EVENTS_STORAGE_FILE_NAME env variable not set")
  }
  return fileName;
};

export async function persistToDrive(jsonData: string) {
  await authorize().then((client) => {
    const drive = Drive.drive({ version: 'v3', auth: client as OAuth2Client });

    googleDriveApis.createOrUpdateFile(drive, fileName(), folderId, jsonData);
    setJsonResponseCache(jsonData);
  }).catch(console.error);
}

export async function readStorageFromDrive() {

  if (getJsonResponseCache() !== undefined) {
    return getJsonResponseCache();
  }

  try {
    // log only in production
    if (process.env.NODE_ENV === 'production') {
      console.log("readStorageFromDrive from:  ", fileName())
    }
    const client = await authorize()
    const drive = Drive.drive({ version: 'v3', auth: client as OAuth2Client });
    const fileId = await googleDriveApis.getFileIdFromFilename(drive, fileName(), folderId);
    if (fileId !== undefined && fileId !== null) {
      const jsonResponse = await googleDriveApis.readJsonContentFromDrive(drive, fileId);
      setJsonResponseCache(jsonResponse);
      return jsonResponse;
    }
    return undefined;
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}



