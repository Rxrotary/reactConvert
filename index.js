const puppeteer = require('puppeteer');
var fs = require('fs');

void (async () => {


    var categories = ['city-management', 'climate-and-weather', 'commerce-and-industry',
        'development', 'education', 'employment-and-labour', 'environment',
        'finance', 'food', 'health', 'housing', 'it-and-broadcasting',
        'law-and-security', 'miscellaneous', 'population', 'recreation-and-culture',
        'social-welfare', 'transport']

    for (category of  categories) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://data.gov.hk/en-datasets/category/${category}?order=name&file-content=no`);

        while (await page.$('#load-more > a') !== null) {
            await page.click('#load-more > a');
            await page.waitFor(3000);
        };

        const info = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.dataset-item'))
                .map(link => ({
                    Title: link.querySelector('div.dataset-content > h3 > a').textContent,
                    Notes: link.querySelector('div.dataset-content > div.notes').textContent,
                    Link: link.querySelector('div.dataset-content > h3 > a').href,
                    Format: link.querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent
                }))
                .slice(0)
        )
        console.log(info);
        await browser.close(); 
        
        const Json2csvParser = require('json2csv').Parser;
        const fields = ['Title', 'Notes', 'Link', 'Format'];
                
        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(info);
 

        fs.writeFileSync(`${category}.csv`, csv);
         
    }


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