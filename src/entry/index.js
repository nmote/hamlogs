// @flow strict

import type {Result} from '../result';
import type {SimpleDate} from './date';
import type {SimpleTime} from './time';

import * as result from '../result';
import {parseDate} from './date';
import {parseTime} from './time';

// TODO use opaque types for date, time, etc.

export type Entry = {|
  call: string,
  date: SimpleDate,
  time: SimpleTime,
  band: string,
  mode: string,
  sigInfo: string | null,
|};

export function date(input: string | null): Result<SimpleDate, string> {
  if (input == null) {
    return result.err('Date must be provided');
  }
  return parseDate(input);
}

export function time(input: string | null): Result<SimpleTime, string> {
  if (input == null) {
    return result.err('Time must be provided');
  }
  return parseTime(input);
}

// TODO add more ham bands
const hamBands: Set<string> = new Set([
  '2200m',
  '630m',
  '160m',
  '80m',
  '60m',
  '40m',
  '30m',
  '20m',
  '17m',
  '15m',
  '12m',
  '10m',
  '6m',
  '2m',
  '1.25m',
  '70cm',
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

export function band(input: string | null): Result<string, string> {
  // TODO ensure that either band or frequency is provided
  // TODO infer band from frequency and allow the user to not specify band
  if (input == null) {
    return result.err('Band must be included');
  }
  const band = normalizeBand(input);
  if (!hamBands.has(band)) {
    return result.err('Band must be a valid ham band');
  }
  return result.ok(band);
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

export function mode(inputParam: string | null): Result<string, string> {
  let input = inputParam;
  if (input == null) {
    return result.err('Mode must be included');
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

export function call(input: string | null): Result<string, string> {
  if (input == null) {
    return result.err("The other station's callsign must be provided");
  }
  return result.ok(normalizeCall(input));
}

export function sigInfo(input: string | null): Result<string | null, string> {
  // TODO Validate park number for when this is used for POTA
  return result.ok(input);
}
