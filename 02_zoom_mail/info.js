//node info.js --url=https://us04web.zoom.us/signin

let nodemailer = require('nodemailer');
let puppeteer = require("puppeteer");
let minimist = require("minimist");
let args = minimist(process.argv);
let fs = require("fs");

let jso = fs.readFileSync("config.json","utf-8");
let config = JSON.parse(jso);


//code excutes after 10 sec
setTimeout(myFunc, 10000);
//code excutes after 10 sec


async function myFunc() 
{
    let browser = await puppeteer.launch({
        headless: false,
        args: 
        [
            '--start-maximized'
        ],
        defaultViewport: null
    })

    let pages = await browser.pages();
    let page = pages[0];

    await page.goto(args.url);
    await page.waitForSelector("input[id='email']");
    await page.type("input[id='email']",config.zoom);

    await page.waitForSelector("input[placeholder='Password']");
    await page.type("input[placeholder='Password']", config.zoompass);

    await page.waitFor(1000);

    await page.waitForSelector("div.signin");
    await page.click("div.signin");

    await page.waitForSelector("a[tracking-id='leftNavRecording']");
    await page.click("a[tracking-id='leftNavRecording']");
    
    //assuming that i found attribute of link using $eval
    let link = "https://zoom.us/rec/share/J1ar5D99G2LUc5o3sXsIsxMhmZ9pur9_uf1055sCGLsTTpmWsgPlceySTVP7R1TN.ro5JXymXIIWNFD2b";
    sendEmail(link)

    await page.waitFor(3000)

    await page.close();


    
}

function sendEmail(link)
{
    let fromMail = 'kartjone506@gmail.com';
    let toMail = 'kartiksharma5027@gmail.com';

    let subject  = 'zoom recording solution';
    let text = link;
    let transporter = nodemailer.createTransport
    ({
        service: 'gmail',
        auth: 
        {
            user: config.zoom,
            pass: config.gmailpass
        }
    });

    // email options
    let mailOptions = {
        from: fromMail,
        to: toMail,
        subject: subject,
        text: text
    };

    // send email
    transporter.sendMail(mailOptions, (error, response) => 
    {
        if (error) 
        {
            console.log(error);
        }
        console.log(response)
    });
}