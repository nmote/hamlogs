// @flow strict

import type {Result} from './result';
export type {Result};

import {parse} from './parse';
import {toAdif} from './adif';

export function CSVToAdif(
  callsign: string,
  park: string,
  inputText: string
): Result<string, Array<string>> {
  // TODO validate callsign and park
  const log = parse(inputText);
  if (log.kind === 'err') {
    return log;
  }
  return toAdif(callsign, park, log.value);
}
