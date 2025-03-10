import { STORAGE_STATE } from '../playwright.config';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

async function globalSetup(): Promise<void> {
  if (fs.existsSync(STORAGE_STATE)) {
    fs.unlinkSync(STORAGE_STATE);
  }
  dotenv.config({ override: true });
  // console.log('!!! URL:', process.env.BASE_URL);
}
export default globalSetup;
