'use-strict'
const path = require('path')
const fs = require('fs')

/**
 * 
 * @param {string} content string para salvar
 * @param {string} p caminho destino
 */
const saveToPath = (content, p) => {
  try {
    const dirPath = path.dirname(p)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(p);
    }
    fs.writeFileSync(p, content);
  } catch(err) {
    throw err;
  }
}

/**
 * Function to format time to time with ms
 * @param {string} time formatted as mm:ss or hh:mm:ss 
 */
const toStringWithMs = time => {
  const camps = time.split(":");
  const hasHour = camps.length > 2;

  let hh, mm, ss;
  
  mm = camps[0];
  ss = camps[1];

  if (hasHour)
    hh = camps[2];

  return `${hh || '00'}:${mm}:${ss},000`
}

module.exports = {
  saveToPath,
  toStringWithMs
}
