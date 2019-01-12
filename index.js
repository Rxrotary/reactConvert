const puppeteer = require('puppeteer')

void (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://data.gov.hk/en-datasets/category/finance?order=name&file-content=no');

    while (await page.$('#load-more > a') !== null) {
        await page.click('#load-more > a');
        await page.waitFor(3000);
    };

    await page.waitForSelector('div.dataset-content > h3 > a');
    const stories = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('div.dataset-content > h3 > a'))
        return links.map(link => link.href).slice(0)
    })
    console.log(stories);
    await browser.close();
})();



/*
const teams = await page.evalutate(()=> {
    const grabFromRow = (row, classname) => row
        .querySelector('td.${classname}')
        .innerText
        .trim()

    const TEAM_ROW_SELECTOR = 'tr.team'

    const data= []

    const teamRows =document.querySelectorAll(TEAM_ROW_SELECTOR)

    for (const tr of teamRows) {
        data.push({
            name: grabFromRow(tr,'name'),
            year: grabFromRow(tr, 'year')
            wins: grabFromRow(tr, 'wins')
            losses: grabFromRow(tr, 'losses')

        })
    }

    return data
})

console.log(JSON.stringify(teams, null, 2))

*/