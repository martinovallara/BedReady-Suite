import { authenticate } from '@google-cloud/local-auth';
import fs from 'fs/promises';
import { OAuth2Client, GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth.js';
import path from 'path';

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
  type Credentials = {
    type: string;
    client_id: string;
    client_secret: string;
    refresh_token: string;
  };

  /**
   * Load or request or authorization to call APIs.
   *
   */
  export default async function authorize() {
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
   * Reads previously authorized credentials from the save file.
   *
   * @return {Promise<OAuth2Client|null>}
   */
  async function loadSavedCredentialsIfExist() {
    try {
      //console.log("TOKEN_PATH: ", TOKEN_PATH)
      const content = await fs.readFile(TOKEN_PATH);
  
       // deserialize content to JSONClient 
      const credentials: Credentials = JSON.parse(content.toString());
      // create JSONClient from credentials
      const auth = new GoogleAuth();
      const client = await auth.fromJSON(credentials);
      return client;
      

    } catch (err) {
      return null;
    }
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
    const payload  = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
  }
  