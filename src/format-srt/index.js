'use-strict'

const { toStringWithMs } = require('../utils')

const timeRegex = /\d\d:\d\d/

const formatToSrt = (rawString) => {
  let index = 1;
  return rawString.split('\n')
    .reduce((srtLines, line) => {
      if (line.match(timeRegex)) {
        srtLines.push(String(index++));
        srtLines.push(toStringWithMs(line))
      } else {
        srtLines.push(line);
      }
      return srtLines;
    }, [])
    .join('\n')
}

module.exports = formatToSrt
