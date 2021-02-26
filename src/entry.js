// TODO generate user-friendly error messages
const assert = require('assert').strict

module.exports.date = function(input) {
  assert(input != null, 'Date must be provided');
  // TODO relax this restriction, e.g. YYYY-MM-DD should be fine
  assert(input.length === 8, 'Date must be in the format YYYYMMDD');
  // TODO do some additional validation
  return input;
}

module.exports.time = function(input) {
  assert(input != null, 'Time must be provided');
  // TODO also allow HHMMSS, HH:MM, HH:MM:SS
  assert(input.length === 4, 'Time must be in the format HHMM');
  // TODO do some additional validation
  return input + '00';
}

// TODO add more ham bands
const hamBands = new Set([
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

function normalizeBand(input) {
  if (/^[0-9.]+$/.test(input)) {
    // If we have no units, assume it's meters
    input = input + 'm';
  }
  // Remove whitespace
  input = input.replace(/ /g, '');
  return input.toLowerCase(input);
}

module.exports.band = function(input) {
  // Band isn't required because the user could specify frequency instead.
  // TODO ensure that either band or frequency is provided
  // TODO infer band from frequency
  if (input != null) {
    input = normalizeBand(input);
    assert(hamBands.has(input), 'Band must be a valid ham band');
  }
  return input;
}

// We'll use ADIF modes here. They may require summarization or modification for
// certain outputs, but that's okay.
// TODO add more modes
// TODO infer mode from submode
const hamModes = new Set([
  'AM',
  'CW',
  'FM',
  'SSB',
]);

function normalizeMode(input) {
  return input.toUpperCase();
}

module.exports.mode = function(input) {
  assert(input != null, 'Mode must be included');
  input = normalizeMode(input);
  assert(hamModes.has(input), 'Mode must be valid');
  return input;
}

function normalizeCall(input) {
  // It's probably futile to try to validate the callsign.
  return input.toUpperCase();
}

module.exports.call = function(input) {
  assert(input != null, 'The other station\'s callsign must be provided');
  return normalizeCall(input);
}

module.exports.sigInfo = function(input) {
  // TODO Validate park number for when this is used for POTA
  return input;
}
