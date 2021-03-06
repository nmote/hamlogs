import {columnOrder_TEST as columnOrder} from './parse';

test('columnOrder succesfully determines the position of each column', () => {
  expect(columnOrder([
    'Date',
    'Time',
    'Band',
    'Mode',
    'Call',
    'Other park',
  ])).toEqual(new Map([
    ['date', 0],
    ['time', 1],
    ['band', 2],
    ['mode', 3],
    ['call', 4],
    ['sig_info', 5],
  ]));
  expect(columnOrder([
    'Other-PArk',
    'Call',
    'Mode',
    'band',
    'TiMe',
    'Date',
  ])).toEqual(new Map([
    ['date', 5],
    ['time', 4],
    ['band', 3],
    ['mode', 2],
    ['call', 1],
    ['sig_info', 0],
  ]));
});
