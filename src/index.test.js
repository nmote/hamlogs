import {CSVToAdif} from './index';
import fs from 'fs';

const CSVPath = __dirname + '/../fixtures/K-3213.csv';

const ADIPath = __dirname + '/../fixtures/K-3213.adi';

test('It gives correct ADIF output for a CSV file', () => {
  const CSVText = fs.readFileSync(CSVPath).toString();
  const ADIText = fs.readFileSync(ADIPath).toString();
  expect(CSVToAdif('K7NCM', 'K-3213', CSVText)).toEqual(ADIText);
});
