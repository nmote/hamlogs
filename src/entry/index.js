// @flow strict

import type {Result} from '../result';
import type {SimpleDate} from './date';
import type {SimpleTime} from './time';

import * as result from '../result';
import {parseDate} from './date';
import {parseTime} from './time';

export type {SimpleDate, SimpleTime};

// TODO use opaque types for date, time, etc.

export type Entry = {|
  +call: string | null,
  +date: SimpleDate | null,
  +time: SimpleTime | null,
  +band: string | null,
  +mode: string | null,
  +sigInfo: string | null,
|};

export function date(input: string | null): Result<SimpleDate | null, string> {
  if (input == null) {
    return result.ok(null);
  }
  return parseDate(input);
}

export function time(input: string | null): Result<SimpleTime | null, string> {
  if (input == null) {
    return result.ok(null);
  }
  return parseTime(input);
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

export function band(
  bandInput: string | null,
  freqInput: string | null
): Result<string | null, string> {
  if (bandInput != null) {
    const band = normalizeBand(bandInput);
    if (!hamBands.has(band)) {
      return result.err('Band must be a valid ham band');
    }
    return result.ok(band);
  } else if (freqInput != null) {
    const freq = Number.parseFloat(freqInput);

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
      return result.ok(matchingBand);
    }
  } else {
    return result.ok(null);
  }
}

// We'll use ADIF modes here. They may require summarization or modification for
// certain outputs, but that's okay.
//
// See: https://adif.org/311/ADIF_311.htm#Mode_Enumeration
//
// TODO add more modes
// TODO infer mode from submode
const hamModes: Set<string> = new Set([
  'AM',
  'CW',
  'FM',
  'FT8',
  'PSK',
  'RTTY',
  'SSTV',
  'OLIVIA',
  'SSB',
]);

function normalizeMode(input: string): string {
  return input.toUpperCase();
}

export function mode(inputParam: string | null): Result<string | null, string> {
  let input = inputParam;
  if (input == null) {
    return result.ok(null);
  }
  input = normalizeMode(input);
  if (!hamModes.has(input)) {
    return result.err('Mode must be valid');
  }
  return result.ok(input);
}

function normalizeCall(input: string): string {
  // It's probably futile to try to validate the callsign.
  return input.toUpperCase();
}

export function call(input: string | null): Result<string | null, string> {
  if (input == null) {
    return result.ok(null);
  }
  return result.ok(normalizeCall(input));
}

export function sigInfo(input: string | null): Result<string | null, string> {
  // TODO Validate park number for when this is used for POTA
  return result.ok(input);
}
