import { connect } from 'puppeteer-real-browser'
import cluster from 'cluster'
import os from 'os';
import process from 'process';

function waitforme(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
}
// // const numCPUs = availableParallelism();
const numCPUs = os.cpus().length;
// const maxCPU = numCPUs - 2

console.log("numCPUs", numCPUs)
if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        // console.log('worker',worker.state)
        if (worker.state === 'dead') {
            console.log(new Date() + ' Worker committed suicide');
            cluster.fork();
        }
    });
} else {
    const clusterBrowser = async () => {
        connect({
            tf: true, // If a feature you want to use at startup is not working, you can initialize the tf variable false and update it later.
            turnstile: true,
            // proxy: {
            //     host: '',
            //     port: '',
            //     username: '',
            //     password: ''
            // }
        })
            .then(async response => {
                const { page, browser, setTarget } = response
                // console.log('browser',browser)

                for (let i = 0; i < 4; i++) {
                    // domcontentloaded
                    try {
                        await page.goto('https://base64.uk/', {
                            waitUntil: 'load'
                        })
                        setTarget({ status: false })
                    } catch (error) {
                        console.log("trycatch1", error)

                        await page.goto('https://base64.uk/', {
                            waitUntil: 'load'
                        })
                        setTarget({ status: false })
                    }
                    try {
                        let p = await browser.newPage();
                        setTarget({ status: true })
                        await p.goto("https://base64.uk/", { waitUntil: 'load' });


                    } catch (error) {
                        console.log("trycatch2", error)
                        let p = await browser.newPage();
                        setTarget({ status: true })
                        await p.goto("https://base64.uk/", { waitUntil: 'load' });
                        console.log(i)

                    }
                    console.log(i)

                }
                // await page.close()
                await browser.close()
                await waitforme(15000)
                await clusterBrowser()

            })
            .catch(error => {
                console.log(error.message)
            })
    }
    await clusterBrowser()
}


