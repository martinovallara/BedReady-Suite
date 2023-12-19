import { promptLoop } from './promptLoop.js';
import dotenv from 'dotenv';


let envPath = '.env';

switch (process.env.NODE_ENV) {
  case 'development':
    envPath = '.env.dev';
    break;
  case 'test':
    envPath = '.env.test';
    break;
  case 'production':
    envPath = '.env';
    break;
}
console.log("envPath: ", envPath);
dotenv.config({ path: envPath });

await promptLoop();

