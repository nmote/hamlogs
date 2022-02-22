// @flow strict

import type {Result} from '../result';

import * as result from '../result';
import {maybeToResult} from '../utils';

export interface Band {
  toADIFBand(): string;
  toSOTABand(): string;
}

class Range {
  +start: number;
  +end: number;
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  contains(x) {
    return this.start <= x && this.end >= x;
  }
}

class BandImpl {
  +band: string;
  +freqs: Range;
  // Representative frequency for the band in MHz.
  +sotaFreq: string;

  constructor(band: string, freqs: Range, sotaFreq: string) {
    this.band = band;
    this.freqs = freqs;
    this.sotaFreq = sotaFreq;
  }

  toADIFBand(): string {
    return this.band.toUpperCase();
  }

  toSOTABand(): string {
    return this.sotaFreq + 'MHz';
  }
}

function normalizeBand(inputParam: string): string {
  let input = inputParam;
  if (/^[0-9.]+$/.test(input)) {
    // If we have no units, assume it's meters
    input = input + 'm';
  }
  // Remove whitespace
  input = input.replace(/ /g, '');
  return input.toLowerCase();
}

function makeHamBandEntry(name: string, freqs: Range, sotaFreq: string): [string, BandImpl] {
  return [name, new BandImpl(name, freqs, sotaFreq)];
}

// TODO add more ham bands
// TODO check frequency ranges against international allocations
// SOTA frequencies are taken from
// https://www.sotadata.org.uk/en/upload/activator/csv/info except where noted.
const hamBands: Map<string, BandImpl> = new Map([
  // The SOTA page does not have an entry listed for this band, so I have chosen
  // a representative frequency that is within it.
  makeHamBandEntry('2200m', new Range(0.1357, 0.1378), '0.136'),
  // The SOTA page does not have an entry listed for this band, so I have chosen
  // a representative frequency that is within it.
  makeHamBandEntry('630m', new Range(0.472, 0.479), '0.475'),
  makeHamBandEntry('160m', new Range(1.8, 2.0), '1.8'),
  makeHamBandEntry('80m', new Range(3.5, 4.0), '3.5'),
  makeHamBandEntry('60m', new Range(5.3305, 5.4065), '5'),
  makeHamBandEntry('40m', new Range(7.0, 7.3), '7'),
  makeHamBandEntry('30m', new Range(10.1, 10.15), '10'),
  makeHamBandEntry('20m', new Range(14.0, 14.35), '14'),
  makeHamBandEntry('17m', new Range(18.068, 18.168), '18'),
  makeHamBandEntry('15m', new Range(21.0, 21.45), '21'),
  makeHamBandEntry('12m', new Range(24.89, 24.99), '24'),
  makeHamBandEntry('10m', new Range(28.0, 29.7), '28'),
  makeHamBandEntry('6m', new Range(50.0, 54.0), '50'),
  makeHamBandEntry('2m', new Range(144.0, 148.0), '144'),
  // The SOTA page does not have an entry listed for this band, so I have chosen
  // a representative frequency that is within it.
  makeHamBandEntry('1.25m', new Range(219.0, 225.0), '222'),
  makeHamBandEntry('70cm', new Range(420.0, 450.0), '432'),
  makeHamBandEntry('23cm', new Range(1240, 1300), '1240'),
]);

export function parseBand(input: string): Result<Band, string> {
  const bandString = normalizeBand(input);
  const band = hamBands.get(bandString);
  return maybeToResult(band, 'Band must be a valid ham band');
}

export function freqToBand(input: string): Result<Band, string> {
  const freq = Number.parseFloat(input);

  let matchingBand = null;
  for (const band of hamBands.values()) {
    if (band.freqs.contains(freq)) {
      matchingBand = band;
      break;
    }
  }

  if (matchingBand == null) {
    return result.err(`No band found for frequency ${freq} MHz`);
  } else {
    return result.ok(matchingBand);
  }
}
