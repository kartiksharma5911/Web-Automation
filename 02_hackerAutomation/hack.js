// node .\hack.js --url=https://www.hackerrank.com --config=config.json

let minimist = require("minimist");
let puppeteer = require("puppeteer");
let fs = require("fs");

let args = minimist(process.argv);

let configJSO = fs.readFileSync("config.json", "utf-8");
let config = JSON.parse(configJSO);

async function run()
{
    let browser = await puppeteer.launch({headless : false,
    defaultViewport : null, 
    args:['--start-maximized']
    });
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(args.url);
    
    await page.waitForSelector("li#menu-item-2887");
    await page.click("li#menu-item-2887");

    await page.waitForSelector('a[href="https://www.hackerrank.com/login"]')
    await page.click('a[href="https://www.hackerrank.com/login"]')

    await page.waitForSelector('input[placeholder="Your username or email"]');
    await page.type('input[placeholder="Your username or email"]', config.userid , {delay : 15});
    
    await page.waitForSelector('input[placeholder="Your password"]');
    await page.type('input[placeholder="Your password"]', config.password, {delay : 15});

    await page.waitForSelector("button[data-analytics='LoginPassword']");
    await page.click("button[data-analytics='LoginPassword']");

    await page.waitForSelector('a[data-analytics="NavBarContests"]');
    await page.click('a[data-analytics="NavBarContests"]');

    await page.waitForSelector('a[href="/administration/contests/"]');
    await page.click('a[href="/administration/contests/"]');
    
    await page.waitForSelector('a[data-attr1="Last"]');
    let numPages = await page.$eval('a[data-attr1="Last"]', function (tag){
        let totalpages = parseInt(tag.getAttribute("data-page"));
        return totalpages;
    })

    for(let i = 1; i <= numPages; i++ )
    {
        await page.waitForSelector("a.backbone.block-center");
        let urls = await page.$$eval("a.backbone.block-center", function (tags)
        {
            let curls = [];
            for(let i = 0; i < tags.length; i++)
            {
                let url = tags[i].getAttribute("href");
                curls.push(url);
            }
            return curls;
        });
        
    
        for(let i = 0;i < urls.length; i++)
        {
            let ctab = await browser.newPage();
            await saveModeratorInContest(ctab, args.url + urls[i]);
            await ctab.close();
            await page.waitFor(1000)
        }
       if(i != numPages)
       {
           await page.waitForSelector('a[data-attr1="Right"]');
           await page.click('a[data-attr1="Right"]');
       }
    }
    
    await page.close();
}
run()


async function saveModeratorInContest(ctab, fullCurl) 
{
    await ctab.bringToFront();
    await ctab.goto(fullCurl);
    
    await ctab.waitFor(2000);
    await ctab.waitForSelector('li[data-tab="moderators"]');
    await ctab.click('li[data-tab="moderators"]')
    
    await ctab.waitForSelector('input#moderator');
    await ctab.type('input#moderator', config.moderator, {delay : 20});
    await ctab.keyboard.press("Enter");
    await ctab.waitFor(1000);
    
}
