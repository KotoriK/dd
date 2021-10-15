import { main } from './main.mjs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { importJSON } from './utils/importJSON.mjs'
import logger from './logger.mjs'

const { interval } = importJSON('./config.json', {
    "host": "127.0.0.1",
    "port": 5700,
    "accessToken": "",
    "interval": 60000,
    "subs": [
    ]
})
const args = yargs(hideBin(process.argv))
    .version()
    .options({
        'schedule': {
            alias: 's',
            describe: '启用定时',
        },
    })
    .help()
    .argv

if (args.schedule == true) {
    timer()
} else {
    main()
}
async function timer() {
    logger.info('开始执行')
    await main()
    logger.info('完成一次执行，开始休眠')
    setTimeout(timer, interval)
}