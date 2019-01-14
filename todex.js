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
  const info = await page.evaluate(() => 
  Array.from(document.querySelectorAll('tr')[2])
  .map(link => ({
      Title: link.querySelector('th.wide2').textContent,
      Notes: link.querySelector('th.wide-td').textContent,
      //Link: link.querySelector('div.dataset-content > h3 > a').href,
      //Format: link.querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent
  }))

  )
  await page.waitFor(5000);

  console.log(info);
  await browser.close();
})();