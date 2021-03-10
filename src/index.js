// @flow strict

import {parse} from './parse';
import {toAdif} from './adif';

export function CSVToAdif(callsign: string, park: string, inputText: string): string {
  // TODO validate callsign and park
  const log = parse(inputText);
  const adif = toAdif(callsign, park, log);
  return adif;
}
