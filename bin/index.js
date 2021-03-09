#!/usr/bin/env node

// TODO make this whole piece of software not shitty

const {main} = require('../lib/run');

const callsign = process.argv[2];
const park = process.argv[3];
const inputFile = process.argv[4];

process.stdout.write(main(callsign, park, inputFile));
