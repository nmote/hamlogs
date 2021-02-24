const {main} = require('./run');
const fs = require('fs');

const CSVPath = __dirname + '/../fixtures/K-3213.csv';

const ADIPath = __dirname + '/../fixtures/K-3213.adi';

test('It gives correct ADIF output for a CSV file', () => {
  const ADIText = fs.readFileSync(ADIPath).toString();
  expect(main(CSVPath, 'K7NCM', 'K-3213')).toEqual(ADIText);
});
