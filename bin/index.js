#!/usr/bin/env node

// TODO make this whole piece of software not shitty

const {main} = require('../src/run');

const inputFile = process.argv[2];
const callsign = process.argv[3];
const park = process.argv[4];

process.stdout.write(main(inputFile, callsign, park));
