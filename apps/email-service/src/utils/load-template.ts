import { readFile } from 'fs/promises';
import Handlebars from 'handlebars';
import path from 'path';

export async function loadTemplate(name: string, data: unknown) {
  const templatePath = path.join(process.cwd(), 'templates', `${name}.hbs`);
  const templateSource = await readFile(templatePath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  return template(data);
}
