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
});
