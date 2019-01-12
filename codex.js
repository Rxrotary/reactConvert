const puppeteer = require('puppeteer')

void (async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://www.ahmics.com/animal-house-list/index.html');


/*
  while (await page.$('#load-more > a') !== null) {
    await page.click('#load-more > a');
    await page.waitFor(3000);
  };
*/

const listing = await page.evaluate(() => {
    
    const grabData = (row, classname) => row
      .querySelector(`th.${classname}`)
      .textContent
      .trim()

    const listRows = document.querySelectorAll('tr')
    const data = []
    for (const tr of listRows) {
      data.push({
        StoreName: grabData(tr, 'wide2'),
        info: grabData(tr, 'wide-td')
      })
    }
    return data;
  })


  console.log(data);
  await browser.close();
})();