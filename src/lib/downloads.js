import release from '../release.json' with { type: 'json' };

export function downloadBase(value = 'https://downloads.legalmasr.com/releases/v0.2.4') {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) {
    throw new Error('Download base must be an HTTPS URL without credentials, query or fragment');
  }
  return url.href.replace(/\/$/, '');
}

export function fileUrl(file, base) {
  if (![...release.assets.map(a => a.file), 'SHA256SUMS.txt'].includes(file)) {
    throw new Error('Unknown release file');
  }
  return `${downloadBase(base)}/${encodeURIComponent(file)}`;
}

const commands = {
  'linux-deb': file => `sudo apt install ./${file}`,
  'linux-rpm': file => `sudo dnf install ./${file}`,
  'linux-appimage': file => `chmod +x ${file} && ./${file}`,
};
export const downloads = release.assets.map(asset => ({
  ...asset,
  ext: `.${asset.file.split('.').pop()}`,
  arch: 'x64',
  size: `${(asset.bytes / 1_000_000).toFixed(1)} MB`,
  command: commands[asset.id],
}));
export { release };
