// @flow strict

import type {Entry} from './entry';
import type {Result} from './result';

import * as Papa from 'papaparse';

import * as entry from './entry';
import * as result from './result';
import {objectValues} from './utils';

const canonicalToAlternates = new Map([
  ['date', []],
  ['time', []],
  ['band', []],
  ['mode', []],
  ['call', []],
  ['sig_info', ['other_park']],
]);

const nameToCanonicalName = new Map();

for (const [canonical, alternates] of canonicalToAlternates) {
  nameToCanonicalName.set(canonical, canonical);
  for (const alternate of alternates) {
    nameToCanonicalName.set(alternate, canonical);
  }
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[ -]/g, '_');
}

function columnOrder(headerRow: Array<string>): Map<string, number> {
  const order = new Map();
  headerRow.forEach((name, i) => {
    const normalized = normalizeName(name);
    const canonical = nameToCanonicalName.get(normalized);
    if (canonical != null) {
      order.set(canonical, i);
    }
  });
  return order;
}

function extractCell(order, row, name) {
  const index = order.get(name);
  if (index == null) {
    return null;
  }
  const result = row[index];
  if (result === '') {
    // The CSV parser gives us the empty string if a cell is empty
    return null;
  }
  return result;
}

type EntryResult = $ObjMap<Entry, <T>(T) => Result<T, string>>;

function collectErrors<E>(arr: $ReadOnlyArray<Result<mixed, E>>): Array<E> {
  const errors = [];
  for (const x of arr) {
    if (x.kind === 'err') {
      errors.push(x.err);
    }
  }
  return errors;
}

function entryResultToEntry(entry: EntryResult): Result<Entry, Array<string>> {
  if (
    entry.date.kind === 'ok' &&
    entry.time.kind === 'ok' &&
    entry.band.kind === 'ok' &&
    entry.mode.kind === 'ok' &&
    entry.call.kind === 'ok' &&
    entry.sigInfo.kind === 'ok'
  ) {
    return result.ok({
      date: entry.date.value,
      time: entry.time.value,
      band: entry.band.value,
      mode: entry.mode.value,
      call: entry.call.value,
      sigInfo: entry.sigInfo.value,
    });
  } else {
    return result.err(collectErrors(objectValues<Result<mixed, string>>(entry)));
  }
}

function parseRow(order, row): Result<Entry, Array<string>> {
  const results: EntryResult = {
    date: entry.date(extractCell(order, row, 'date')),
    time: entry.time(extractCell(order, row, 'time')),
    band: entry.band(extractCell(order, row, 'band')),
    mode: entry.mode(extractCell(order, row, 'mode')),
    call: entry.call(extractCell(order, row, 'call')),
    sigInfo: entry.sigInfo(extractCell(order, row, 'sig_info')),
  };
  return entryResultToEntry(results);
}

// Mutates the accumulator, aliases the errors
function addErrors<V, E>(accumulator: Result<V, Array<E>>, errs: Array<E>): Result<V, Array<E>> {
  if (accumulator.kind === 'ok') {
    return result.err(errs);
  } else {
    accumulator.err.push(...errs);
    return accumulator;
  }
}

// Mutates the accumulator
function addSuccess<V, E>(accumulator: Result<Array<V>, E>, value: V): Result<Array<V>, E> {
  if (accumulator.kind === 'ok') {
    accumulator.value.push(value);
    return accumulator;
  } else {
    return accumulator;
  }
}

export function parse(input: string): Result<Array<Entry>, Array<string>> {
  // TODO add Flow typedefs for this
  // TODO handle errors
  const csv = Papa.parse(input, {header: false, skipEmptyLines: true}).data;
  const order = columnOrder(csv.shift());

  let results = result.ok([]);
  csv.forEach((row, i) => {
    const entryResult = parseRow(order, row);
    if (entryResult.kind === 'ok') {
      results = addSuccess(results, entryResult.value);
    } else {
      const errs = entryResult.err.map((err) => `Entry #${i + 1}: ${err}`);
      results = addErrors(results, errs);
    }
  });
  return results;
}

export const columnOrder_TEST = columnOrder;
