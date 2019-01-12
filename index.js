const puppeteer = require('puppeteer');
var stringify = require('csv-stringify');

void (async () => {


    var categories = ['city-management', 'climate-and-weather', 'commerce-and-industry',
        'development', 'education', 'employment-and-labour', 'environment',
        'finance', 'food', 'health', 'housing', 'it-and-broadcasting',
        'law-and-security', 'miscellaneous', 'population', 'recreation-and-culture',
        'social-welfare', 'transport']

    for (i in categories) {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://data.gov.hk/en-datasets/category/${categories[i]}?order=name&file-content=no`);

        while (await page.$('#load-more > a') !== null) {
            await page.click('#load-more > a');
            await page.waitFor(3000);
        };

        const info = await page.evaluate(() =>
            Array.from(document.querySelectorAll('.dataset-item'))
                .map(link => ({
                    title: link.querySelector('div.dataset-content > h3 > a').textContent,
                    notes: link.querySelector('div.dataset-content > div.notes').textContent,
                    link: link.querySelector('div.dataset-content > h3 > a').href,
                    format: link.querySelector('div.group-resource-format > ul.dataset-resources.list-unstyled > li > span > a').textContent
                }))
                .slice(0, 3)
        )
        console.log(info);
        await browser.close(); 
        
        var input = [] 
        var line = logLine.split(",");
        input.push(line);
        
        await stringify(input, function(err, info){
          fs.writeFile(`${categoreis[i]}.csv`, info);


         
        });
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