import fs from 'fs/promises';
import * as path from 'path';
import dayjs from 'dayjs';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(tz);
dayjs.extend(utc);

export async function loadKey(keyName: string) {
  return await fs.readFile(
    path.join(process.cwd(), '/keys', `${keyName}.pem`),
    'utf-8',
  );
}

export { dayjs };
