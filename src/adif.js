// @flow strict

import type {Entry, SimpleDate, SimpleTime, Band} from './entry';
import type {Result} from './result';

import {objectValues, maybeToResult, extractErrors, collateErrors} from './utils';
import * as result from './result';

function makeItem(name: string, textParam: string | null): string {
  let text = textParam;
  // TODO handle non-ASCII
  if (text == null) {
    // TODO consider omitting null entries entirely
    text = '';
  }
  return `<${name}:${text.length}>${text}`;
}

function makeHeader() {
  return `hamlogs by nmote ${makeItem('ProgramID', 'hamlogs')}<EOH>`;
}

type POTAEntry = {|
  +call: string,
  +date: SimpleDate,
  +time: SimpleTime,
  +band: Band,
  +mode: string,
  +sigInfo: string | null,
|};

function makeLine(stationCallSign: string, myPark: string, entry: POTAEntry): string {
  return (
    makeItem('STATION_CALLSIGN', stationCallSign) +
    makeItem('MY_SIG', 'POTA') +
    makeItem('MY_SIG_INFO', myPark) +
    makeItem('CALL', entry.call) +
    makeItem('QSO_DATE', entry.date.toString()) +
    makeItem('TIME_ON', entry.time.toString()) +
    makeItem('BAND', entry.band.toADIFBand()) +
    makeItem('MODE', entry.mode) +
    makeItem('SIG_INFO', entry.sigInfo) +
    '<eor>'
  );
}

function entryToPOTAEntry(entry: Entry): Result<POTAEntry, Array<string>> {
  const potaResult = {
    call: maybeToResult(entry.call, "The other station's callsign must be provided"),
    date: maybeToResult(entry.date, 'Date must be provided'),
    time: maybeToResult(entry.time, 'Time must be provided'),
    band: maybeToResult(entry.band, 'Band or frequency must be included'),
    mode: maybeToResult(entry.mode, 'Mode must be included'),
    sigInfo: result.ok(entry.sigInfo),
  };
  if (
    potaResult.call.kind === 'ok' &&
    potaResult.date.kind === 'ok' &&
    potaResult.time.kind === 'ok' &&
    potaResult.band.kind === 'ok' &&
    potaResult.mode.kind === 'ok' &&
    potaResult.sigInfo.kind === 'ok'
  ) {
    return result.ok({
      call: potaResult.call.value,
      date: potaResult.date.value,
      time: potaResult.time.value,
      band: potaResult.band.value,
      mode: potaResult.mode.value,
      sigInfo: potaResult.sigInfo.value,
    });
  } else {
    return result.err(extractErrors(objectValues<Result<mixed, string>>(potaResult)));
  }
}

export function toAdif(
  stationCallSign: string,
  myPark: string,
  log: Array<Entry>
): Result<string, Array<string>> {
  const potaEntries: Result<Array<POTAEntry>, Array<string>> = collateErrors(
    log.map(entryToPOTAEntry)
  );
  return result.bind(potaEntries, (entries) => {
    const lines = [];
    lines.push(makeHeader());
    entries.forEach((entry) => {
      lines.push(makeLine(stationCallSign, myPark, entry));
    });
    return result.ok(lines.join('\n') + '\n');
  });
}

export const makeLine_TEST = makeLine;
