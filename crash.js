const puppeteer = require('puppeteer')
const { executablePath } = require('puppeteer')
const fs = require('fs')


async function testFunction() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-features=site-per-process', '--disable-setuid-sandbox'],
        ignoreDefaultArgs: ['--disable-extensions'],
        headless: true,
        executablePath: executablePath(),
    })

    console.log('page rendered')


    const page = await browser.newPage()
    await page.setViewport({
        width: 0,
        height: 0
    })

    await page.goto('https://in.1xbet.com/games-frame/games/371?wh=50&lg=en&cu=99&co=71&tzo=5.5', {
        waitUntil: "domcontentloaded",
    })


    await page.waitForSelector('#games_page > div.crash.games-container__game > div.crash-players-bets.crash__wrap.crash__wrap--left > div.crash-players-bets__total.crash-total > div:nth-child(2) > span')
    let element = await page.$('#games_page > div.crash.games-container__game > div.crash-players-bets.crash__wrap.crash__wrap--left > div.crash-players-bets__total.crash-total > div:nth-child(2) > span')

    await page.exposeFunction('writefile', async data => {
        return new Promise((resolve, reject) => {

            fs.appendFileSync("data.json", data, (err, text) => {
                if (err) reject(err);
                else resolve(text);
            });
        });
    });
    await page.evaluate(


        function observeDom() {
            //total bets
            var target = document.querySelector('#games_page > div.crash.games-container__game > div.crash-players-bets.crash__wrap.crash__wrap--left > div.crash-players-bets__total.crash-total > div:nth-child(2) > span');
            //multiplier
            var target2 = document.querySelector("#games_page > div.crash.games-container__game > div.crash__wrap.crash__wrap--main > div.crash__game.crash-game > div.crash-game__timeline > svg > g:nth-child(5) > text");
            //total winning
            var target3 = document.querySelector("#games_page > div.crash.games-container__game > div.crash-players-bets.crash__wrap.crash__wrap--left > div.crash-players-bets__total.crash-total > div:nth-child(3) > span");
            //total player
            var target4 = document.querySelector("#games_page > div.crash.games-container__game > div.crash-players-bets.crash__wrap.crash__wrap--left > div.crash-players-bets__total.crash-total > div:nth-child(1) > span");


            let tbet = [];
            let twin = [];
            let tplay = [];
            let multipl = [];


            var observer = new MutationObserver(function(mutations) {
                const now = Date.now();
                tbet.push(target.innerText);
                twin.push(target3.innerText);
                tplay.push(target4.innerText);
                multipl.push(target2.innerHTML.trim());

                for (i = 0; i < multipl.length; i++) {
                    if (multipl[i] == "x") {

                        console.log(tbet[tbet.length - 1])
                        console.log(twin[twin.length - 1])
                        console.log(tplay[tplay.length - 1])
                        console.log(multipl[multipl.length - 2])
                        console.log(now)

                        let data = {
                            totalbets: tbet[tbet.length - 1],
                            totalwinning: twin[twin.length - 1],
                            totalplayer: tplay[tplay.length - 1],
                            multipl: multipl[multipl.length - 2],
                            date: now,

                        }

                        const content = window.writefile(JSON.stringify(data));

                        tbet.length = 0;
                        twin.lenght = 0;
                        tplay.length = 0;
                        multipl.length = 0;

                    }
                }



            });

            var config = {
                attributes: true,
                childList: true,
                characterData: true,
                subtree: true
            };



            console.log(observer.observe(target2, config))
        })
    let value = await page.evaluate(el => el.textContent, element)
    console.log(value)




}
testFunction();
