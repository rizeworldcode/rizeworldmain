import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const archiver = require('archiver');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '..', 'dist');
const zipFilePath = path.join(__dirname, '..', 'dist.zip');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist to zip.');
  process.exit(1);
}

// Remove old zip if exists
if (fs.existsSync(zipFilePath)) {
  fs.unlinkSync(zipFilePath);
}

const output = fs.createWriteStream(zipFilePath);
const archive = typeof archiver === 'function' 
  ? archiver('zip', { zlib: { level: 9 } }) 
  : new archiver.ZipArchive({ zlib: { level: 9 } });

output.on('close', () => {
  console.log(`✓ Successfully created dist.zip (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
});

archive.on('error', (err) => {
  console.error('Error creating zip:', err);
  process.exit(1);
});

archive.pipe(output);
archive.directory(distDir, false);
archive.finalize();
