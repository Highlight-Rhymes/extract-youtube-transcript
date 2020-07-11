const extractFromUrlArray = require('./extract-transcript')
const path = require('path');

const YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=FmXIiQBmW18',
  'https://www.youtube.com/watch?v=WILNIXZr2oc'
] // urls do youtube que o puppeteer vai crawlear atrás dos transcripts
const DEST_PATH = path.join('..') // caminho para salvar os transcritos 


extractFromUrlArray(YOUTUBE_URLS, DEST_PATH)
  .then(_ => console.log("fim"))
  .catch(err => {
    throw err; 
  })
