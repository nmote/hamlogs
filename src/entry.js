// @flow

// TODO generate user-friendly error messages

// $FlowFixMe[missing-export] this export does exist at runtime
import {strict as invariant} from 'assert';

// TODO use opaque types for date, time, etc.

export type Entry = {|
  call: string,
  date: string,
  time: string,
  band: string,
  mode: string,
  sigInfo: string,
|};

export function date(input: string | null): string {
  invariant(input != null, 'Date must be provided');
  // TODO relax this restriction, e.g. YYYY-MM-DD should be fine
  invariant(input.length === 8, 'Date must be in the format YYYYMMDD');
  // TODO do some additional validation
  return input;
}

export function time(input: string | null): string {
  invariant(input != null, 'Time must be provided');
  // TODO also allow HHMMSS, HH:MM, HH:MM:SS
  invariant(input.length === 4, 'Time must be in the format HHMM');
  // TODO do some additional validation
  return input + '00';
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

function normalizeBand(input: string): string {
  if (/^[0-9.]+$/.test(input)) {
    // If we have no units, assume it's meters
    input = input + 'm';
  }
  // Remove whitespace
  input = input.replace(/ /g, '');
  return input.toLowerCase();
}

export function band(input: string | null): string | null {
  // Band isn't required because the user could specify frequency instead.
  // TODO ensure that either band or frequency is provided
  // TODO infer band from frequency
  if (input != null) {
    input = normalizeBand(input);
    invariant(hamBands.has(input), 'Band must be a valid ham band');
  }
  return input;
}

// We'll use ADIF modes here. They may require summarization or modification for
// certain outputs, but that's okay.
// TODO add more modes
// TODO infer mode from submode
const hamModes: Set<string> = new Set([
  'AM',
  'CW',
  'FM',
  'SSB',
]);

function normalizeMode(input: string): string {
  return input.toUpperCase();
}

export function mode(input: string | null): string {
  invariant(input != null, 'Mode must be included');
  input = normalizeMode(input);
  invariant(hamModes.has(input), 'Mode must be valid');
  return input;
}

function normalizeCall(input: string): string {
  // It's probably futile to try to validate the callsign.
  return input.toUpperCase();
}

export function call(input: string | null): string {
  invariant(input != null, 'The other station\'s callsign must be provided');
  return normalizeCall(input);
}

export function sigInfo(input: string | null): string | null {
  // TODO Validate park number for when this is used for POTA
  return input;
}
