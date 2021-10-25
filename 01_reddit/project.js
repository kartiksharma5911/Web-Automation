// node project.js --url=https://www.reddit.com/ --topic=

let puppeteer = require('puppeteer');
let minimist = require('minimist');
let args = minimist(process.argv);

(async () => 
{
    let browser = await puppeteer.launch(
    {
        headless : true,
        args :['--start-maximized',
        '--use-fake-ui-for-media-stream',
        '--disable-notifications'],
        defaultViewport : null
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(args.url);
    await page.waitForSelector('input[id="header-search-bar"]')
    await page.click('input[id="header-search-bar"]');
    await page.type('input[id="header-search-bar"]', args.topic, {delay : 20})

    await page.keyboard.press("Enter");
    await page.waitForNetworkIdle();
    await page.waitFor(2000)
    await page.pdf({path: 'Result.pdf', format: 'A4'});
    
    await browser.close();

})().catch(function(err){console.log(err)});
