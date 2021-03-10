// @flow strict

import fs from 'fs';
// $FlowFixMe[missing-export] this export does exist at runtime
import {strict as invariant} from 'assert';
import {parse} from './parse';
import {toAdif} from './adif';

function CSVToAdif(callsign: string, park: string, inputText: string): string {
  // TODO validate callsign and park
  const log = parse(inputText);
  const adif = toAdif(callsign, park, log);
  return adif;
}

export function main(callsign: ?string, park: ?string, inputFile: ?string): string {
  // TODO do proper validaton
  invariant(inputFile != null);
  invariant(callsign != null);
  invariant(park != null);
  const inputText = fs.readFileSync(inputFile).toString();
  return CSVToAdif(callsign, park, inputText);
}
