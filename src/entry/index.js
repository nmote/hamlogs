// @flow strict

import type {Result} from '../result';
import type {SimpleDate} from './date';
import type {SimpleTime} from './time';
import type {Band} from './band';

import * as result from '../result';
import {parseDate} from './date';
import {parseTime} from './time';
import {parseBand, freqToBand} from './band';

export type {SimpleDate, SimpleTime, Band};

// TODO use opaque types for date, time, etc.

export type Entry = {|
  +call: string | null,
  +date: SimpleDate | null,
  +time: SimpleTime | null,
  +band: Band | null,
  +mode: string | null,
  +sigInfo: string | null,
  +otherSummit: string | null,
  +notes: string | null,
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

export function band(
  bandInput: string | null,
  freqInput: string | null
): Result<Band | null, string> {
  if (bandInput != null) {
    return parseBand(bandInput);
  } else if (freqInput != null) {
    return freqToBand(freqInput);
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

export function otherSummit(input: string | null): Result<string | null, string> {
  // TODO Validate summit identifier
  return result.ok(input);
}

export function notes(input: string | null): Result<string | null, string> {
  return result.ok(input);
}
