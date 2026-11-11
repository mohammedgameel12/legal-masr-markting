import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { verifyRelease } from '../scripts/verify-release.mjs';
import { fileUrl, downloadBase, downloads, release } from '../src/lib/downloads.js';

test('download URLs pin all five real release packages and checksum file to R2', () => {
  assert.equal(downloads.length, 5);
  for (const item of downloads) {
    assert.match(fileUrl(item.file), /^https:\/\/downloads\.legalmasr\.com\/releases\/v0\.2\.4\//);
    assert.ok(item.bytes > 0);
    assert.match(item.sha256, /^[a-f0-9]{64}$/);
  }
  assert.ok(fileUrl('SHA256SUMS.txt').endsWith('/SHA256SUMS.txt'));
  assert.ok(!downloads.some(item => item.group === 'macos'));
  assert.equal(release.version, '0.2.4');
});

test('download configuration rejects unsafe or unknown destinations', () => {
  for (const value of ['http://example.com', 'javascript:alert(1)', 'https://user:pass@example.com', 'https://example.com/?token=x', 'https://example.com/#x']) {
    assert.throws(() => downloadBase(value));
  }
  assert.throws(() => fileUrl('../unknown.exe'));
  assert.equal(fileUrl('SHA256SUMS.txt', 'https://cdn.example.com/v0.2.4/'), 'https://cdn.example.com/v0.2.4/SHA256SUMS.txt');
});

async function fixture(t) {
  const dir = await mkdtemp(join(tmpdir(), 'legal-release-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const data = Buffer.from('release fixture');
  const sha256 = createHash('sha256').update(data).digest('hex');
  const manifest = { assets: [{ file: 'test.exe', bytes: data.length, sha256 }] };
  const checksums = `${sha256}  test.exe\n`;
  await writeFile(join(dir, 'test.exe'), data);
  await writeFile(join(dir, 'SHA256SUMS.txt'), checksums);
  return { dir, manifest, checksums };
}

test('accepts verified artifacts before upload', async t => {
  const {dir, manifest} = await fixture(t);
  assert.equal(await verifyRelease(dir, manifest), 1);
});
test('refuses corrupted and missing packages', async t => {
  const {dir, manifest} = await fixture(t);
  await writeFile(join(dir, 'test.exe'), 'corrupted');
  await assert.rejects(verifyRelease(dir, manifest), /integrity failure/);
  await rm(join(dir, 'test.exe'));
  await assert.rejects(verifyRelease(dir, manifest), /ENOENT/);
});
test('refuses substituted, extra and duplicate checksum entries', async t => {
  const {dir, manifest, checksums} = await fixture(t);
  await writeFile(join(dir, 'SHA256SUMS.txt'), `${'0'.repeat(64)}  test.exe\n`);
  await assert.rejects(verifyRelease(dir, manifest), /manifest mismatch/);
  await writeFile(join(dir, 'SHA256SUMS.txt'), checksums + checksums);
  await assert.rejects(verifyRelease(dir, manifest), /duplicate/);
  await writeFile(join(dir, 'SHA256SUMS.txt'), checksums + `${'0'.repeat(64)}  extra.exe\n`);
  await assert.rejects(verifyRelease(dir, manifest), /file count/);
});
