import { resolve } from 'node:path';
import { serve } from '../parity/site.mjs';

const [dir, port] = process.argv.slice(2);
const { url } = await serve(resolve(dir), Number(port));
console.log(`serving ${resolve(dir)} at ${url}`);
