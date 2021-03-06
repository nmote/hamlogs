import fs from 'fs';
import {parse} from './parse';
import {toAdif} from './adif';

export function main(inputFile, callsign, park) {
  // TODO validate callsign and park
  const file = fs.readFileSync(inputFile).toString();
  const log = parse(file);
  const adif = toAdif(callsign, park, log);
  return adif;
}
