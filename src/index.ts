import { promptLoop } from './promptLoop.js';

import dotenv from 'dotenv';

dotenv.config({path: '.env'});

console.log('STORAGE_PATH', process.env.STORAGE_PATH);

await promptLoop();

