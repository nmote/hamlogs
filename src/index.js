// @flow strict

import type {Result} from './result';
export type {Result};

import * as result from './result';
import {parse} from './parse';
import {toAdif} from './adif';
import {toSota} from './sotacsv';

export type LogOutput = {|
  text: string,
  // YYYYMMDD. null if the log is empty
  earliestEntryDate: string | null,
|};

function getEarliestDate(log): string | null {
  let oldest = null;
  for (const entry of log) {
    if (oldest == null) {
      oldest = entry.date;
      continue;
    }
    if (entry.date != null && entry.date.toString() < oldest.toString()) {
      oldest = entry.date;
    }
  }
  if (oldest != null) {
    return oldest.toString();
  } else {
    return null;
  }
}

export function CSVToAdif(
  callsign: string,
  park: string,
  inputText: string
): Result<LogOutput, Array<string>> {
  // TODO validate callsign and park
  return result.bind(parse(inputText), (log) => {
    const earliestEntryDate = getEarliestDate(log);

    return result.bind(toAdif(callsign, park, log), (text) =>
      result.ok({
        text,
        earliestEntryDate,
      })
    );
  });
}

export function CSVToSOTA(
  callsign: string,
  summit: string,
  inputText: string
): Result<LogOutput, Array<string>> {
  // TODO validate callsign and summit
  return result.bind(parse(inputText), (log) => {
    const earliestEntryDate = getEarliestDate(log);

    return result.bind(toSota(callsign, summit, log), (text) =>
      result.ok({
        text,
        earliestEntryDate,
      })
    );
  });
}
