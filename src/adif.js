// @flow

import type {Entry} from './entry';

function makeItem(name: string, text: string): string {
  // TODO handle non-ASCII
  if (text == null) {
    // TODO consider omitting null entries entirely
    text = '';
  }
  return `<${name}:${text.length}>${text}`
}

function makeHeader() {
  return `hamlogtool by nmote ${makeItem('ProgramID', 'hamlogtool')}<EOH>`;
}

function makeLine(stationCallSign: string, myPark: string, entry: Entry): string {
  return makeItem('STATION_CALLSIGN', stationCallSign) +
      makeItem('OPERATOR', '') +
      makeItem('MY_SIG', 'POTA') +
      makeItem('MY_SIG_INFO', myPark) +
      makeItem('CALL', entry.call) +
      makeItem('QSO_DATE', entry.date) +
      makeItem('TIME_ON', entry.time) +
      makeItem('BAND', entry.band.toUpperCase()) +
      makeItem('MODE', entry.mode) +
      makeItem('SIG', '') +
      makeItem('SIG_INFO', entry.sigInfo) +
      makeItem('NOTES', '') +
      '<eor>'
}

export function toAdif(stationCallSign: string, myPark: string, log: Array<any>): string {
  const lines = []
  lines.push(makeHeader());
  log.forEach(entry => { lines.push(makeLine(stationCallSign, myPark, entry))});
  return lines.join('\n') + '\n';
}

export const makeLine_TEST = makeLine;
