const puppeteer = require('puppeteer')

void (async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://data.gov.hk/en-datasets/category/finance?order=name&file-content=no');



  while (await page.$('#load-more > a') !== null) {
    await page.click('#load-more > a');
    await page.waitFor(3000);
  };


  /*
    const info = await page.evaluate(() =>
      Array.from(document.querySelectorAll('#dataset-search-results > div'))
        .map(link => ({
          title: link.querySelector('div.dataset-content > h3 > a').textContent,
          notes: link.querySelector('div.dataset-content > div.notes').textContent,
          link: link.querySelector('div.dataset-content > h3 > a').href,
          format: link.querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent
        }))
          .slice(0, 4)
        )
*/

  await page.waitForSelector('#dataset-search-results > div');
  const info = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('div.dataset-content >  h3 > a'))
    return links.map(link => ({title: link.textContent, web:link.href})).slice(0)
      /*note: link.querySelector('div.dataset-content > div.notes').textContent,
      web: link.querySelector('div.dataset-content > h3 > a').href,
      formats: link.querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent
    */
  })

/*
const listing = await page.evaluate(() => {
    
    const grabData = (row, classname) => row
      .querySelector('td.${classname}')

    const listRows = document.querySelectorAll('#dataset-search-results > div')
    const data = []
    for (const tr of listRows) {
      data.push({
        title: querySelector('div.dataset-content > h3 > a').textContent,
        notes: querySelector('div.dataset-content > div.notes').textContent,
        link: querySelector('div.dataset-content > h3 > a').href,
        format: querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent

      })
    }
    return data;
  })
*/

  console.log(info);
  await page.waitFor(3000);
  await browser.close();
})();