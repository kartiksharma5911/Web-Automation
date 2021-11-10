// node file.js --url=https://login.microsoftonline.com/ --config=config.json

var curr = new Date;
let minimist = require("minimist");
let fs = require("fs");
let puppeteer = require("puppeteer");
let args = minimist(process.argv);
let schedule = require("node-schedule");


let configJso = fs.readFileSync(args.config , "utf-8");
let config = JSON.parse(configJso);

// let jso = fs.readFileSync("data.json", "utf-8")
// let data = JSON.parse(jso);


let x = "";
let y = "";
if(curr.getDay() == 4)
{
    x = "li h3[id='team-19:u8FWYcayg4_67qCyQGGz7Unm46TXXQeYxp2K-zmxpKg1@thread.tacv2']";
    y = "button[data-tid='join-btn-dc0fb44c-4176-4bd2-ad47-f5ce3f5bc753']";
}else if(curr.getDay() == 6)
{
    x = 'li h3[id="team-19:G3aOVrjxMNMGYBOVAz47rL-0tfiMiCRygGWmjZ-DuNU1@thread.tacv2"]'
    y = 'calling-thread-header button[track-name="337"]'
}else if(curr.getDay() == 1)
{
    x = 'li h3[id="team-19:RFLnbMroimfoXc0E06wAZoQ1LBxDD_lKVxOh-a8-LFc1@thread.tacv2"]';
    y = 'calling-thread-header button[track-name="337"]';
}else if(curr.getDay() == 2)
{
    x = 'li h3[id="team-19:X_33Snu7QmpCMLA_SMG66rCpA_JD4zqMrBdynGCE1nY1@thread.tacv2"]'
    y = 'calling-thread-header button[track-name="337"]'
}else if(curr.getDay() == 3)
{
    x = 'li h3[id="team-19:X_33Snu7QmpCMLA_SMG66rCpA_JD4zqMrBdynGCE1nY1@thread.tacv2"]'
    y = 'button[data-tid="join-btn-9730e6a6-f837-4990-8714-781bf3199fd0"]'
}


async function teams()
{
    let browser = await puppeteer.launch({headless : false,
    args : ['--start-maximized',
    '--use-fake-ui-for-media-stream'],
    defaultViewport : null
    })
    let pages = await browser.pages();
    let page = pages[0];
    await page.goto(args.url);
    await page.waitForSelector('input[id="i0116"]');
    await page.click('input[id="i0116"]');
    await page.waitFor(1000);
    
    await page.type('input[id="i0116"]', config.userid, {delay : 10});
    await page.keyboard.press("Enter");

    await page.waitFor(3000)
    await page.waitForSelector('input[id="i0118"]');
    await page.click('input[id="i0118"]');
    await page.type('input[id="i0118"]', config.pass, {delay : 30});
    await page.keyboard.press("Enter");
    
    await page.waitForSelector('input[id="idSIButton9"]');
    await page.click('input[id="idSIButton9"]');

    let job =  schedule.scheduleJob({hour: 10, minute: curr.getMinutes() + 1, dayOfWeek: curr.getDay()}, async () =>
    {
            let ctab = await browser.newPage();
            await ctab.goto("https://teams.microsoft.com/", {waitUntil : "networkidle0"});
            await ctab.waitFor(17000);
        
            await ctab.waitForSelector('div.toastbody.toast-actions div.actions>button[title="Dismiss"]');
            await ctab.click('div.toastbody.toast-actions div.actions>button[title="Dismiss"]');
        
            
            await ctab.waitFor(3000) 
            await ctab.waitForSelector(x);
            await ctab.click(x);
        
            await ctab.waitFor(9000)
            await ctab.waitForSelector(y)
            await ctab.click(y)
        
            await ctab.waitFor(4000)
            await ctab.waitForSelector('button[aria-pressed="true"][track-name="1046"] > span');
            await ctab.click('button[aria-pressed="true"][track-name="1046"] > span');
            
            await ctab.waitForSelector('toggle-button button[track-name="1047"] > span');
            await ctab.click('toggle-button button[track-name="1047"] > span');
            
            await ctab.waitFor(2000)
            await ctab.waitForSelector('button[track-name="337"]');
            await ctab.click('button[track-name="337"]');

            let job2 =  schedule.scheduleJob({hour: 10, minute: curr.getMinutes() + 3, dayOfWeek: curr.getDay()}, async () =>
            {
                console.log(curr.getMinutes());

                await ctab.waitFor(10000)
                await ctab.close();
                await page.close();
                job2.cancel();
            })
            job.cancel() 
            
    })
      

}
teams().catch(function(err){console.log(err)})
