const parseCSV = require('csv-parse/lib/sync');

const canonicalToAlternates = new Map([
  ['Date', []],
  ['Time', []],
  ['Band', []],
  ['Mode', []],
  ['Call', []],
  ['Sig Info', ['Other park']],
]);

const nameToCanonicalName = new Map();

for (const [canonical, alternates] of canonicalToAlternates) {
  nameToCanonicalName.set(canonical, canonical);
  for (const alternate of alternates) {
    nameToCanonicalName.set(alternate, canonical);
  }
}

function columnOrder(headerRow) {
  const order = new Map();
  headerRow.forEach((name, i) => {
    const canonical = nameToCanonicalName.get(name);
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
    date: extractCell(order, row, 'Date'),
    time: extractCell(order, row, 'Time') + '00',
    band: extractCell(order, row, 'Band') + 'M',
    mode: extractCell(order, row, 'Mode'),
    call: extractCell(order, row, 'Call'),
    sigInfo: extractCell(order, row, 'Sig Info'),
  }
}

module.exports.parse = function(input) {
  const csv = parseCSV(input);
  const order = columnOrder(csv.shift());

  return csv.map(row => parseRow(order, row));
}

module.exports.columnOrder_TEST = columnOrder;
