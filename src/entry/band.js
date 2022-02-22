// @flow strict

import type {Result} from '../result';
import * as result from '../result';

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

// TODO add more ham bands
// TODO check frequency ranges against international allocations
const hamBands: Map<string, Range> = new Map([
  ['2200m', new Range(0.1357, 0.1378)],
  ['630m', new Range(0.472, 0.479)],
  ['160m', new Range(1.8, 2.0)],
  ['80m', new Range(3.5, 4.0)],
  ['60m', new Range(5.3305, 5.4065)],
  ['40m', new Range(7.0, 7.3)],
  ['30m', new Range(10.1, 10.15)],
  ['20m', new Range(14.0, 14.35)],
  ['17m', new Range(18.068, 18.168)],
  ['15m', new Range(21.0, 21.45)],
  ['12m', new Range(24.89, 24.99)],
  ['10m', new Range(28.0, 29.7)],
  ['6m', new Range(50.0, 54.0)],
  ['2m', new Range(144.0, 148.0)],
  ['1.25m', new Range(219.0, 225.0)],
  ['70cm', new Range(420.0, 450.0)],
]);

class BandImpl {
  +band: string;

  constructor(band: string) {
    this.band = band;
  }

  toADIFBand(): string {
    return this.band.toUpperCase();
  }

  toSOTABand(): string {
    // TODO support all bands
    switch (this.toADIFBand()) {
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
}

export function parseBand(input: string): Result<Band, string> {
  const band = normalizeBand(input);
  if (!hamBands.has(band)) {
    return result.err('Band must be a valid ham band');
  }
  return result.ok(new BandImpl(band));
}

export function freqToBand(input: string): Result<Band, string> {
  const freq = Number.parseFloat(input);

  let matchingBand = null;
  for (const [b, range] of hamBands) {
    if (range.contains(freq)) {
      matchingBand = b;
      break;
    }
  }

  if (matchingBand == null) {
    return result.err(`No band found for frequency ${freq} MHz`);
  } else {
    return result.ok(new BandImpl(matchingBand));
  }
}
