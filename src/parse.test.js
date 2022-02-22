import {columnOrder_TEST as columnOrder} from './parse';

test('columnOrder succesfully determines the position of each column', () => {
  expect(
    columnOrder(['Date', 'Time', 'Band', 'Mode', 'Call', 'Other park', 'Other summit', 'notes'])
  ).toEqual(
    new Map([
      ['date', 0],
      ['time', 1],
      ['band', 2],
      ['mode', 3],
      ['call', 4],
      ['sig_info', 5],
      ['other_summit', 6],
      ['notes', 7],
    ])
  );
  expect(columnOrder(['sig-iNfo', 'COMmENTS', 'Call', 'Mode', 'band', 'TiMe', 'Date'])).toEqual(
    new Map([
      ['sig_info', 0],
      ['notes', 1],
      ['call', 2],
      ['mode', 3],
      ['band', 4],
      ['time', 5],
      ['date', 6],
    ])
  );
});
