import { promptLoop } from './promptLoop.js';
import dotenv from 'dotenv';

dotenv.config({path: '.env'});
// TODO: remove events_storage_path from .env 

//console.log('EVENTS_STORAGE_PATH', process.env.EVENTS_STORAGE_PATH);
/*
const result = await readStorageFromDrive()
console.log("Read from DRIVE: ", result)
*/
await promptLoop();

