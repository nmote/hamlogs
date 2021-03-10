// @flow strict

import fs from 'fs';
// $FlowFixMe[missing-export] this export does exist at runtime
import {strict as invariant} from 'assert';

import {CSVToAdif} from './index';

export function main() {
  const callsign = process.argv[2];
  const park = process.argv[3];
  const inputFile = process.argv[4];

  // TODO do proper validaton
  invariant(callsign != null);
  invariant(park != null);
  invariant(inputFile != null);

  const inputText = fs.readFileSync(inputFile).toString();

  process.stdout.write(CSVToAdif(callsign, park, inputText));
}
