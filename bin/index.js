#!/usr/bin/env node

const fs = require('fs');
const { EOL } = require('os');
const { compile } = require('..');

const input = fs.readFileSync(0, 'utf-8');
const compiled = compile(input.replace(/\r*\n/g, '\n'));
const output = compiled.replace(/\n/, EOL);

if (output) {
  process.stdout.write(output + EOL);
}
