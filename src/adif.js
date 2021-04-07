// @flow strict

import type {Entry} from './entry';

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

function makeLine(stationCallSign: string, myPark: string, entry: Entry): string {
  return (
    makeItem('STATION_CALLSIGN', stationCallSign) +
    makeItem('MY_SIG', 'POTA') +
    makeItem('MY_SIG_INFO', myPark) +
    makeItem('CALL', entry.call) +
    makeItem('QSO_DATE', entry.date.toString()) +
    makeItem('TIME_ON', entry.time.toString()) +
    makeItem('BAND', entry.band.toUpperCase()) +
    makeItem('MODE', entry.mode) +
    makeItem('SIG_INFO', entry.sigInfo) +
    '<eor>'
  );
}

export function toAdif(stationCallSign: string, myPark: string, log: Array<Entry>): string {
  const lines = [];
  lines.push(makeHeader());
  log.forEach((entry) => {
    lines.push(makeLine(stationCallSign, myPark, entry));
  });
  return lines.join('\n') + '\n';
}

export const makeLine_TEST = makeLine;
