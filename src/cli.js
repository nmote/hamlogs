// @flow strict

import fs from 'fs';

import {CSVToAdif} from './index';

function usage(): empty {
  process.stderr.write('Hamlogs by nmote K7NCM\n');
  process.stderr.write(
    'Converts a log from CSV to ADIF, suitable for submission to Parks On The Air\n\n'
  );
  process.stderr.write('Usage: hamlogs callsign park-id input-file\n');
  // $FlowFixMe[incompatible-return] process.exit should return `empty`
  return process.exit(1);
}

function assertArg(arg: ?string, msg: string): string {
  if (arg != null) {
    return arg;
  } else {
    process.stderr.write(msg + '\n\n');
    return usage();
  }
}

export function main() {
  const callsign = assertArg(process.argv[2], "Please provide the operator's callsign");
  const park = assertArg(process.argv[3], 'Please provide your park identifier');
  const inputFile = assertArg(process.argv[4], 'Please provide the full path to your CSV file');

  const inputText = fs.readFileSync(inputFile).toString();

  process.stdout.write(CSVToAdif(callsign, park, inputText));
}
