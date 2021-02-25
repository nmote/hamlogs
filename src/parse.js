const parseCSV = require('csv-parse/lib/sync');

function columnOrder(headerRow) {
  // TODO actually read the headers
  return new Map([
    ['Date', 0],
    ['Time', 1],
    ['Band', 2],
    ['Mode', 3],
    ['Call', 4],
    ['Sig Info', 5],
  ]);
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
