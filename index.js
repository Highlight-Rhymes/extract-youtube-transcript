'use stric'
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Os erros abaixo não estão tratados
 * se o chromium do puppeteer estiver com configs de localidade diferente da BR
 *  a seleção do menu vai falhar.
 * Se Não tiver uma transcrição pra esse vídeo.
 * Se o youtube demorar mto pra abrir
 */

const selectors = {
  menu: 'button[aria-label="Mais ações"]', // botão do menu que abre mais opções
  menuItem: 'ytd-menu-service-item-renderer', // itens do menu
  intervalDataDiv: 'div[class="cue-group style-scope ytd-transcript-body-renderer"]' // divs cujo innerText são as traduções
}

const YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=FmXIiQBmW18',
  'https://www.youtube.com/watch?v=WILNIXZr2oc'
] // urls do youtube que o puppeteer vai crawlear atrás dos transcripts
const DEST_PATH = path.join('.') // caminho para salvar os transcritos 

/**
 * 
 * @param {string} url 
 * @returns {Promise<{ transcript: string, title: string }>} pageInfo
 * @property 
 */
const extractFromUrl = async url => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitForSelector(selectors.menu);
    await page.$$eval(selectors.menu, els => {
      let filteredByNoText = els.filter(el => el.innerText === '')
      if (filteredByNoText.length === 0) {
        // throw new Error("Não achou botão de menu");
        return;
      }
      filteredByNoText[0].click()
    })
    await page.click(selectors.menuItem)
    await page.waitForSelector(selectors.intervalDataDiv);
    const title = await page.title();
    const transcript = await page.evaluate(target => {
      return Array.from(document.querySelectorAll(target))
        .map(div => div.innerText)
        .join('\n')
    }, selectors.intervalDataDiv)
    browser.close();
    return {
      title,
      transcript
    };
  } catch(err) {
    throw err;
  }
}

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
 * 
 * @param {string[]} urls
 * @param {string} path
 */
const extractFromUrlArray = async (urls, path) => {
  try {
    for (const url of urls) {
      await extractFromUrl(url)
        .then(({ title, transcript }) => Promise.resolve(saveToPath(transcript, path + title)))
    }
  } catch(err) {
    throw err;
  }
}

extractFromUrlArray(YOUTUBE_URLS, DEST_PATH)
  .then(_ => console.log("fim"))
  .catch(err => {
    throw err; 
  })
