import { connect } from 'puppeteer-real-browser'

function waitforme(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}

const helperFunction = async (newBaseUrl, elements) => {
    var tempData = [];
    // Extracting and logging the text content of each element
    for (const element of elements) {
        // console.log('element',element)sc-i1odl-0
        const identity = await element.$(".sc-i1odl-0")
        const id = await identity?.evaluate(node => node.getAttribute('data-id')) ?? '';
        if (id == undefined || id == null) return '';

        const title = await element.$('.sc-ge2uzh-0')
        const t = await title?.evaluate(node => node.innerText) ?? '';

        const location = await element.$(".sc-ge2uzh-2")
        const l = await location?.evaluate(node => node.innerText) ?? '';

        const description = await element.$(".sc-i1odl-11")
        const d = await description?.evaluate(node => node.innerText) ?? '';

        const price = await element.$('.sc-12dh9kl-3')
        const r = await price?.evaluate(node => node.innerText) ?? ''
        const dollar = r?.includes("USD") ? 18 : 1;
        // console.log('d', dollar)
        const formattedPricing = r?.replaceAll("MN", "")?.replaceAll(",", "")?.replaceAll("USD", "")?.trim();

        const di = await element.$('.sc-1uhtbxc-0')
        const dimedimensionsCard = await di?.evaluate(node => node.innerText) ?? ''

        let formattedMeter = dimedimensionsCard?.trim();
        if (formattedMeter.includes("m²")) {
            formattedMeter = parseFloat(formattedMeter.replaceAll("m²", "").trim());
        } else if (formattedMeter.includes("ha")) {
            formattedMeter = parseFloat(formattedMeter.replaceAll("ha", "").trim()) * 10000;
        }

        const pricingPerMeter = formattedPricing / (formattedMeter * dollar);

        // const elementText = await page.evaluate(element => element.$eval('sc-12dh9kl-3 iqNJlX',node => node.innerText), element);
        tempData.push({
            'page': newBaseUrl,
            'id': id,
            'title': t,
            'pricing': formattedPricing,
            'location': l,
            'description': d,
            'm2': formattedMeter ?? 1,
            'pricingPerMeter': pricingPerMeter ?? 0
        });


    }
    // console.log('tempData', tempData, tempData.length)
    return tempData
}
// http://shnlhwxe-rotate:u6ixvrwq6kch@p.webshare.io:80
const clusterBrowser = async () => {
    let data = await connect({
        // headless : 'auto',
        // fingerprint: true,
        // args: [
        //     '--disable-dev-shm-usage',
        //     '--proxy-server='+conf.vpnServer
        // ],
        // args: [
        //     '--disable-dev-shm-usage',
        //     '--proxy-server=http://shnlhwxe-rotate:u6ixvrwq6kch@p.webshare.io:80'
        // ],
        tf: false, // If a feature you want to use at startup is not working, you can initialize the tf variable false and update it later.
        turnstile: true,
        // proxy: {
        //     host: 'p.webshare.io',
        //     port: '80',
        //     username: 'shnlhwxe-rotate',
        //     password: 'u6ixvrwq6kch'
        // }
    })
        .then(async response => {
            const { page, browser, setTarget } = response
            let baseUrl = "https://www.wg-gesucht.de"
            // let baseUrl = "https://www.immobilienscout24.de/"
            // let baseUrl = 'https://www.zoopla.co.uk/for-sale/property/e16/?q=E16&results_sort=newest_listings&search_source=for-sale'
            // newBaseUrl = `${baseUrl.split('.html')[0]}-pagina-9999.html`;

            
            await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 100000 });
            // setTarget({ status: true })
            await page.waitForSelector('#cmpwelcomebtnyes');


            // let btn = await page.$('#cmpwelcomebtnyes')
            // console.log('btn',btn)
            //*[@id="cmpwelcomebtnyes"]
            // await page.click(btn)
            //*[@id="categories"]/div[2]/button
            //*[@id="categories"]/div[2]/div/div/ul/li[1]/a
            //*[@id="assets_list_pagination"]/ul/li[8]/a
            await page.click('xpath=//*[@id="cmpwelcomebtnyes"]');
            await page.type('#autocompinp', 'Erlangen')
            waitforme(2000)
            await page.waitForSelector('.autocomplete-suggestion');
            await page.click('.autocomplete-suggestion')
            await page.waitForSelector('#categories');
            await page.select('select#categories', '0')
            // await page.click('xpath=//*[@id="categories"]"]');
            // await page.click('xpath=//*[@id="categories"]/option[1]');
            await page.waitForSelector('#search_button');
            await page.click('xpath=//*[@id="search_button"]');
            await page.waitForSelector('.truncate_title.noprint');

            // const detailElm = await page.$(
            //     '#assets_list_pagination > ul'
            // );
            await page.waitForSelector('.btn-group.btn-group-sm.pull-right');
            await page.click('xpath=//*[@id="main_column"]/div[1]/div[2]/div/label[1]')


            await page.waitForSelector('#assets_list_pagination > ul');

            const searchValue = await page.$('#assets_list_pagination > ul')
            const list = await searchValue.$$("li");
            let numberOfPages = []
            for(const li of list){
                const liText = await li?.evaluate(node => node.innerText) ?? '';
                console.log("liText",liText)
                numberOfPages.push(liText)

            }
            
            // const pages = await list[8]?.evaluate(node => node.innerText) ?? '';
            //this line prints 7 so I know that it is identifying the 7 <li>
            console.log('tets',parseInt(numberOfPages[list.length - 2]),list.length);

            await page.waitForSelector("#table-compact-list")
            const table = await page.$('#table-compact-list > tbody')
            const trTable = await table.$$("tr");
            const apartementData = []
            for(const tr of trTable){
                const entryTd = await tr.$('.ang_spalte_datum.row_click')
                const entry = await entryTd?.evaluate(node => node.innerText) ?? '';

                const rentPrice = await tr.$('.position-relative.ang_spalte_miete.row_click')
                const price = await rentPrice?.evaluate(node => node.innerText) ?? '';

                const sizeTd = await tr.$('.ang_spalte_groesse.row_click')
                const size = await sizeTd?.evaluate(node => node.innerText) ?? '';

                const distTd = await tr.$('.ang_spalte_stadt.row_click')
                const district = await distTd?.evaluate(node => node.innerText) ?? '';

                const freeFromTd = await tr.$('.ang_spalte_freiab.row_click')
                const freeFrom = await freeFromTd?.evaluate(node => node.innerText) ?? '';

                const freeToTd = await tr.$('.ang_spalte_freibis.row_click')
                const freeTo = await freeToTd?.evaluate(node => node.innerText) ?? '';

                let data = {
                    // url: baseUrl + a,
                    // title: title,
                    entry_date:entry,
                    district: district,
                    price: price,
                    size: size,
                    free_from: freeFrom,
                    free_to:freeTo
                }
                apartementData.push(data);

            }
            // const card = await page.$$('.col-sm-8.card_body')
            
            // for (const element of card) {
            //     const titleDiv = await element.$('.truncate_title.noprint')
            //     const title = await titleDiv?.evaluate(node => node.innerText) ?? '';

            //     const aTag = await titleDiv.$('a')
            //     const a = await aTag?.evaluate(node => node.getAttribute('href')) ?? ''

            //     const subTitle = await element.$('.col-xs-11')
            //     const st = await subTitle?.evaluate(node => node.innerText) ?? '';

            //     const priceDiv = await element.$('.col-xs-3')
            //     const price = await priceDiv?.evaluate(node => node.innerText) ?? '';

            //     const sizeDiv = await element.$('.col-xs-3.text-right')
            //     const size = await sizeDiv?.evaluate(node => node.innerText) ?? '';


            //     // const ele = await element.$('.col-xs-9')
            //     // console.log('e;e',ele)
            //     // const onlineEle = await ele?.evaluate(node => node.) ?? '';
            //     // console.log('onlineEle',onlineEle)
            //     const onlineDiv = await element.$('.col-xs-9')
            //     const online = await onlineDiv?.evaluate(node => node.innerText) ?? '';

            //     const time = online.split(':')[1] ?? ''
            //     let data = {
            //         url: baseUrl + a,
            //         title: title,
            //         subTitle: st,
            //         price: price,
            //         size: size,
            //         online: time,
            //     }
            //     apartementData.push(data);


            // }
            console.log('apartementData', apartementData);

            // const titleElements = await page.$$('.truncate_title.noprint');
            // console.log('ele',elements)
            // for (const element of titleElements) {
            //     // const title = await element.$('.sc-ge2uzh-0')
            //     const t = await element?.evaluate(node => node.innerText) ?? '';
            //     console.log('t',t)

            // }
            // const subTitleElements = await page.$$('.col-xs-11');
            // for (const element of subTitleElements) {
            //     // const title = await element.$('.sc-ge2uzh-0')
            //     const t = await element?.evaluate(node => node.innerText) ?? '';
            //     console.log('st',t)

            // }
            // for (let i = 1; i < 20; i++) {
            //     console.log('p',baseUrl)
            //     let p = await browser.newPage()
            //     await p.goto(baseUrl);
            //     // setTarget({ status:true })
            // }

            // await page.waitForSelector('.sc-1tt2vbg-5');
            // var url = page.url();
            // var pagination = url.match(/-pagina-(\d+)\.html/);
            // setTarget({ status: false })
            // console.log('pagination[1]',pagination[1])
            // var currentPageLoop = 3;
            // var newBaseUrl;
            // var returnData = [] ;
            // for (let i = 1; i < parseInt(pagination[1])+1; i++) {
            //     console.log('i',i)
            //     newBaseUrl = `${baseUrl.split('.html')[0]}-pagina-${i}.html`;
            //     console.log("currentPageLoop", newBaseUrl)
            //     let p = await browser.newPage()
            //     // if (i === 1) {
            //         try {
            //             await p.goto(newBaseUrl, { waitUntil: "domcontentloaded", timeout: 100000 });
            //             setTarget({ status: true })
            //             // Waiting for a specific element to be generated by JavaScript
            //             await p.waitForSelector('.sc-1tt2vbg-5');

            //             const elements = await p.$$('.sc-1tt2vbg-5');
            //             // console.log('elements', elements.length)
            //             setTarget({ status: false })
            //             let Data =  await helperFunction(newBaseUrl, elements)
            //             returnData.push(...Data)
            //         } catch (error) {
            //             console.log("trycatch1", error)
            //             // await p.goto(newBaseUrl, { waitUntil: "domcontentloaded", timeout: 100000 });
            //             // setTarget({ status: true })
            //             // // await page.waitForFunction(
            //             // //     'window.performance.timing.loadEventEnd - window.performance.timing.navigationStart >= 10000'
            //             // // );
            //             // // Waiting for a specific element to be generated by JavaScript
            //             // await p.waitForSelector('.sc-1tt2vbg-5');

            //             // const elements = await p.$$('.sc-1tt2vbg-5');
            //             // // console.log('elements', elements.length)
            //             // setTarget({ status: false })

            //             // returnData =  await helperFunction(newBaseUrl, elements)
            //         }

            //     await p.close()

            // }
            // await browser.close()
            // return returnData
        })
        .catch(error => {
            console.log(error.message)
            return "Something went wrong.Try After Sometime or Contact to Developer"
        })
    return data
}
await clusterBrowser().then((res) => {
    console.log('res')
})


