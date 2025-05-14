#!/usr/bin/env node

const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const removeNPMAbsolutePaths = require('removeNPMAbsolutePaths');
const pkg = require('@yao-pkg/pkg');

const cwd = process.cwd();

async function stripAbsolutePathsFromDependencies() {
  try {
    const results = await removeNPMAbsolutePaths(cwd);
    results.forEach((result) => {
      if (!result.success) {
        console.error(result.err.message);
      }
    });
  } catch(err) {
    console.error(err.message, err);
  }
}

async function packageStandaloneBinaries(version) {
  const outDir = 'dist';

  const result = await Promise.all(
    ['win', 'macos', 'linux'].map(async (platform) => {
      const filename = 'aegsc-' + platform + (version ? `-${version}` : '') + (platform === 'win' ? '.exe' : '');
      const outFile = path.join(outDir, filename);

      console.log('Creating executable:', outFile);
      await pkg.exec([
        cwd,
        '-t', `latest-${platform}`,
        '-o', outFile,
        '-C', 'Brotli',
      ]);

      console.log('Calculating SHA-256 hash:', outFile);
      return { filename, hash: await calculateFileHash(outFile) };
    })
  );

  const hashFile = path.join(outDir, `aegsc${version ? `-${version}` : ''}.sha256`);
  console.log('Writing SHA-256 hashes to:', hashFile);
  const hashes = result.map(({ filename, hash }) => `${hash}  ${filename}`).join('\n');
  return fs.writeFile(hashFile, hashes);
}

async function calculateFileHash(file) {
  const fileStream = (await fs.open(file)).createReadStream();
  const hash = crypto.createHash('sha256').setEncoding('hex');

  return new Promise((resolve, reject) => {
    fileStream.on('end', () => {
      hash.end();
      resolve(hash.read());
    });
    fileStream.on('error', reject);

    fileStream.pipe(hash);
  });
}

(async () => {
  // the first arg can be a version number
  const version = process.argv[2] || '';

  await stripAbsolutePathsFromDependencies();
  await packageStandaloneBinaries(version);
})();

