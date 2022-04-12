const assert = require('assert').strict;
const { fork } = require('child_process');
const fs = require('fs');
const path = require('path');

const aegsc = require.resolve('../bin');

function runAegsc({ args = [], options = {} } = {}) {
  return fork(aegsc, args, { silent: true, ...options });
}

function wait(proc) {
  return new Promise((resolve) => proc.once('exit', resolve));
}

async function stdout(proc) {
  let output = '';

  proc.stdout.on('data', (chunk) => output += chunk.toString());

  await wait(proc);
  return output;
}

describe('bin', function() {
  let proc = null;

  afterEach(function() {
    proc?.kill();
    proc = null;
  });

  it('should return success with no input', async function() {
    proc = runAegsc({ options: { stdio: ['ignore', null, null, 'ipc'] } });

    const output = await stdout(proc);
    const exitCode = proc.exitCode;

    assert.equal(exitCode, 0);
    assert.equal(output, '');
  });

  it('should compile stdin and return success', async function() {
    const inputStream = fs.createReadStream(path.resolve(__dirname, './fixtures/multiple.aegs'));
    proc = runAegsc();
    inputStream.pipe(proc.stdin);

    const output = await stdout(proc);
    const exitCode = proc.exitCode;

    assert.equal(exitCode, 0);
    assert.equal(output, fs.readFileSync(path.resolve(__dirname, './fixtures/multiple.out'), 'utf-8'));
  });

  it('should compile format-tutorial and return success', async function() {
    const inputStream = fs.createReadStream(path.resolve(__dirname, './fixtures/format-tutorial.aegs'));
    proc = runAegsc();
    inputStream.pipe(proc.stdin);

    const output = await stdout(proc);
    const exitCode = proc.exitCode;

    assert.equal(exitCode, 0);
    assert.equal(output, fs.readFileSync(path.resolve(__dirname, './fixtures/format-tutorial.out'), 'utf-8'));
  });

  it('should compile real-world-example and return success', async function() {
    const inputStream = fs.createReadStream(path.resolve(__dirname, './fixtures/real-world-example.aegs'));
    proc = runAegsc();
    inputStream.pipe(proc.stdin);

    const output = await stdout(proc);
    const exitCode = proc.exitCode;

    assert.equal(exitCode, 0);
    assert.equal(output, fs.readFileSync(path.resolve(__dirname, './fixtures/real-world-example.out'), 'utf-8'));
  });
});
