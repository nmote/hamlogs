// @flow strict

import type {Entry, SimpleDate, SimpleTime, Band} from './entry';
import type {Result} from './result';

import * as Papa from 'papaparse';

import * as result from './result';
import {collateErrors, objectValues, maybeToResult, extractErrors} from './utils';

type SOTAEntry = {|
  +call: string,
  +date: SimpleDate,
  +time: SimpleTime,
  +band: Band,
  +mode: string,
  +otherSummit: string | null,
  +notes: string | null,
|};

function entryToSOTAEntry(entry: Entry): Result<SOTAEntry, Array<string>> {
  const sotaResult = {
    call: maybeToResult(entry.call, "The other station's callsign must be provided"),
    date: maybeToResult(entry.date, 'Date must be provided'),
    time: maybeToResult(entry.time, 'Time must be provided'),
    band: maybeToResult(entry.band, 'Band or frequency must be included'),
    mode: maybeToResult(entry.mode, 'Mode must be included'),
    otherSummit: result.ok(entry.otherSummit),
    notes: result.ok(entry.notes),
  };
  if (
    sotaResult.call.kind === 'ok' &&
    sotaResult.date.kind === 'ok' &&
    sotaResult.time.kind === 'ok' &&
    sotaResult.band.kind === 'ok' &&
    sotaResult.mode.kind === 'ok' &&
    sotaResult.otherSummit.kind === 'ok' &&
    sotaResult.notes.kind === 'ok'
  ) {
    return result.ok({
      call: sotaResult.call.value,
      date: sotaResult.date.value,
      time: sotaResult.time.value,
      band: sotaResult.band.value,
      mode: sotaResult.mode.value,
      otherSummit: sotaResult.otherSummit.value,
      notes: sotaResult.notes.value,
    });
  } else {
    return result.err(extractErrors(objectValues<Result<mixed, string>>(sotaResult)));
  }
}

// TODO support all bands
// TODO move this logic into encapsulated band object
function bandToSOTABand(band: Band): string {
  switch (band.toADIFBand()) {
    case '40M':
      return '7MHz';
    case '20M':
      return '14MHz';
    default:
      // I don't want to plumb a result through this function since it will be
      // encapsulated with a band object soon, and this won't be possible. For
      // now, the SOTA importer will have to catch this if it happens.
      return 'UnsupportedBand';
  }
}

function SOTAEntryToCSVLine(
  stationCallsign: string,
  mySummit: string,
  entry: SOTAEntry
): Array<string | null> {
  return [
    'V2',
    stationCallsign,
    mySummit,
    entry.date.toSOTAString(),
    entry.time.toSOTAString(),
    bandToSOTABand(entry.band),
    entry.mode,
    entry.call,
    entry.otherSummit,
    entry.notes,
  ];
}

export function toSota(
  stationCallsign: string,
  mySummit: string,
  log: Array<Entry>
): Result<string, Array<string>> {
  const sotaEntries: Result<Array<SOTAEntry>, Array<string>> = collateErrors(
    log.map(entryToSOTAEntry)
  );
  return result.bind(sotaEntries, (entries: Array<SOTAEntry>) => {
    const lines = entries.map((entry) => SOTAEntryToCSVLine(stationCallsign, mySummit, entry));
    return result.ok(Papa.unparse(lines) + '\r\n');
  });
}
