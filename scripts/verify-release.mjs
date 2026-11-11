import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const release = JSON.parse(await readFile(new URL('../src/release.json', import.meta.url)));

export async function verifyRelease(directory, manifest = release) {
  const checksums = await readFile(resolve(directory, 'SHA256SUMS.txt'), 'utf8');
  const entries = new Map();
  for (const line of checksums.trim().split(/\r?\n/)) {
    const match = /^([a-f0-9]{64})\s+\*?([A-Za-z0-9_.-]+)$/.exec(line);
    if (!match || entries.has(match[2])) throw new Error('Invalid or duplicate checksum entry');
    entries.set(match[2], match[1]);
  }
  if (entries.size !== manifest.assets.length) throw new Error('Unexpected checksum file count');
  for (const asset of manifest.assets) {
    if (!/^[A-Za-z0-9_.-]+$/.test(asset.file)) throw new Error('Invalid release filename');
    if (entries.get(asset.file) !== asset.sha256) throw new Error(`Checksum manifest mismatch: ${asset.file}`);
    const bytes = await readFile(resolve(directory, asset.file));
    if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) {
      throw new Error(`Release file integrity failure: ${asset.file}`);
    }
  }
  return manifest.assets.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    if (!process.argv[2]) throw new Error('Usage: npm run verify:release -- <download-directory>');
    console.log(`Verified ${await verifyRelease(process.argv[2])} release files against SHA256SUMS.txt and pinned GitHub digests.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
