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
        args: [
            '--disable-dev-shm-usage',
            '--proxy-server=http://shnlhwxe-rotate:u6ixvrwq6kch@p.webshare.io:80'
        ],
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
            // let baseUrl = "https://www.civitekflorida.com/ocrs/county/51/"
            let baseUrl = "https://www.immobilienscout24.de/"
            // let baseUrl = 'https://www.zoopla.co.uk/for-sale/property/e16/?q=E16&results_sort=newest_listings&search_source=for-sale'
            // newBaseUrl = `${baseUrl.split('.html')[0]}-pagina-9999.html`;
            await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 100000 });
            setTarget({ status: true })
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
await clusterBrowser().then((res)=>{
    console.log('res')
})


