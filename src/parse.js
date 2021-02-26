const parseCSV = require('csv-parse/lib/sync');

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
  return name.toLowerCase().replace(/[ -]/g, '_')
}

function columnOrder(headerRow) {
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

function parseRow(order, row) {
  // TODO handle various possible formats for these entries
  return {
    date: extractCell(order, row, 'date'),
    time: extractCell(order, row, 'time') + '00',
    band: extractCell(order, row, 'band') + 'M',
    mode: extractCell(order, row, 'mode'),
    call: extractCell(order, row, 'call'),
    sigInfo: extractCell(order, row, 'sig_info'),
  }
}

module.exports.parse = function(input) {
  const csv = parseCSV(input);
  const order = columnOrder(csv.shift());

  return csv.map(row => parseRow(order, row));
}

module.exports.columnOrder_TEST = columnOrder;
