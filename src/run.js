// @flow strict

import fs from 'fs';
// $FlowFixMe[missing-export] this export does exist at runtime
import {strict as invariant} from 'assert';
import {parse} from './parse';
import {toAdif} from './adif';

export function main(callsign: ?string, park: ?string, inputFile: ?string): string {
  // TODO do proper validaton
  invariant(inputFile != null);
  invariant(callsign != null);
  invariant(park != null);
  // TODO validate callsign and park
  const file = fs.readFileSync(inputFile).toString();
  const log = parse(file);
  const adif = toAdif(callsign, park, log);
  return adif;
}
