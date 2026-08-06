import fs from 'fs/promises';
import * as path from 'path';

export async function loadKey(keyName: string) {
  return await fs.readFile(
    path.join(process.cwd(), '/keys', `${keyName}.pem`),
    'utf-8',
  );
}
