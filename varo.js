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
        fingerprint: true,
        args: [
            '--disable-features=IsolateOrigins,site-per-process',
            '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end'
        ],
        // args: [
        //     '--disable-dev-shm-usage',
        //     '--proxy-server=http://shnlhwxe-rotate:u6ixvrwq6kch@p.webshare.io:80'
        // ],
        tf: false, // If a feature you want to use at startup is not working, you can initialize the tf variable false and update it later.
        turnstile: false,
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
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive'
            });

            let url = 'https://bank.varomoney.com/forgot-password'
            // let url = 'https://bank.varomoney.com/login'
            await page.goto(url)
            // const cookies = [
            //     {
            //       name: 'AEC',
            //       value: 'AQTF6HzOrXBQ0xe7ozpA_HlR2_FFfiS1v3XPl2rZje5r4EgbeWNbCInq3bw',
            //       domain: '.google.com',
            //     },
            //     // Add more cookies if needed
            //   ];
              const cookies = [
                {
                  name: "_gcl_au",
                  value: "1.1.716111555.1716232763"
                },
                {
                  name: "ajs_anonymous_id",
                  value: "c9d0efc2-08e6-4957-96b9-1ef24402a5a7"
                },
                {
                  name: "ab.storage.deviceId.f9e9c828-6ea9-4246-96e0-81aaa22d7b94",
                  value: '{"g":"57c48e3e-6ffe-264f-99e8-f34376bb9501","c":1716232775208,"l":1716232775208}'
                },
                {
                  name: "_gid",
                  value: "GA1.2.919709001.1717661586"
                },
                {
                  name: "_uetsid",
                  value: "9596523023dc11ef9ea021481c751d3d"
                },
                {
                  name: "_uetvid",
                  value: "ddfd852016dd11ef95027dfb6c912e1e"
                },
                {
                  name: "_ga_DGRVFRW43M",
                  value: "GS1.1.1717693537.5.0.1717694738.60.0.0"
                },
                {
                  name: "_ga",
                  value: "GA1.2.734245879.1716232769"
                }
              ];
              
            
              await page.setCookie(...cookies);
            // await page.setRequestInterception(true);
            // page.on('request', request => {
            //     if (request.url().includes('some-blocked-resource')) {
            //         request.abort();
            //     } else {
            //         request.continue();
            //     }
            // });
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


