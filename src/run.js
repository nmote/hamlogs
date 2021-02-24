const fs = require('fs');
const {parse} = require('./parse');
const {toAdif} = require('./adif');

module.exports.main = function(inputFile, callsign, park) {
  // TODO validate callsign and park
  const file = fs.readFileSync(inputFile).toString();
  const log = parse(file);
  const adif = toAdif(callsign, park, log);
  return adif;
}
