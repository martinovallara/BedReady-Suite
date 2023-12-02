import { promptLoop } from './promptLoop.js';

import dotenv from 'dotenv';

dotenv.config({path: '.env'});

console.log('EVENTS_STORAGE_PATH', process.env.EVENTS_STORAGE_PATH);

await promptLoop();

