
function makeItem(name, text) {
  // TODO handle non-ASCII
  return `<${name}:${text.length}>${text}`
}

function makeHeader() {
  return `hamlogtool by nmote ${makeItem('ProgramID', 'hamlogtool')}<EOH>`;
}

function makeLine(stationCallSign, myPark, entry) {
  return makeItem('STATION_CALLSIGN', stationCallSign) +
      makeItem('OPERATOR', '') +
      makeItem('MY_SIG', 'POTA') +
      makeItem('MY_SIG_INFO', myPark) +
      makeItem('CALL', entry.call) +
      makeItem('QSO_DATE', entry.date) +
      makeItem('TIME_ON', entry.time) +
      makeItem('BAND', entry.band) +
      makeItem('MODE', entry.mode) +
      makeItem('SIG', '') +
      makeItem('SIG_INFO', entry.otherPark) +
      makeItem('NOTES', '') +
      '<eor>'
}

module.exports.toAdif = function(stationCallSign, myPark, log) {
  const lines = []
  lines.push(makeHeader());
  log.forEach(entry => { lines.push(makeLine(stationCallSign, myPark, entry))});
  return lines.join('\n');
}
