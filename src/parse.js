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

function parseRow(order, row) {
  // TODO handle various possible formats for these entries
  return {
    date: row[order.get('Date')],
    time: row[order.get('Time')] + '00',
    band: row[order.get('Band')] + 'M',
    mode: row[order.get('Mode')],
    call: row[order.get('Call')],
    sigInfo: row[order.get('Sig Info')],
  }
}

module.exports.parse = function(input) {
  const csv = parseCSV(input);
  const order = columnOrder(csv.shift());

  return csv.map(row => parseRow(order, row));
}

module.exports.columnOrder_TEST = columnOrder;
