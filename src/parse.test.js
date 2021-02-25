const {columnOrder_TEST: columnOrder} = require('./parse');

test('columnOrder succesfully determines the position of each column', () => {
  expect(columnOrder([
    'Date',
    'Time',
    'Band',
    'Mode',
    'Call',
    'Other park',
  ])).toEqual(new Map([
    ['Date', 0],
    ['Time', 1],
    ['Band', 2],
    ['Mode', 3],
    ['Call', 4],
    ['Sig Info', 5],
  ]));
  expect(columnOrder([
    'Other park',
    'Call',
    'Mode',
    'Band',
    'Time',
    'Date',
  ])).toEqual(new Map([
    ['Date', 5],
    ['Time', 4],
    ['Band', 3],
    ['Mode', 2],
    ['Call', 1],
    ['Sig Info', 0],
  ]));
});
