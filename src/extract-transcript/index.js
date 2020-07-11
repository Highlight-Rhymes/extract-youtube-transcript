'use strict'

const puppeteer = require('puppeteer');
const { saveToPath } = require('../utils');
const toSRT = require('../format-srt');

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

/**
 * 
 * @param {string} url 
 * @returns {Promise<{ transcript: string, title: string }>} pageInfo
 * @property 
 */
exports.extractFromUrl = async url => {
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
 * @param {string[]} urls
 * @param {string} path
 */
const extractFromUrlArray = async (urls, path) => {
  try {
    for (const url of urls) {
      await exports.extractFromUrl(url)
        .then(({ title, transcript }) => Promise.resolve(
            saveToPath(
              toSRT(transcript), // convert transcript from html to .srt format
              path + title + '.srt'
            )
          )
        )
    }
  } catch(err) {
    throw err;
  }
}

module.exports = extractFromUrlArray;
