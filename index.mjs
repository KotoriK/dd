import { main } from './main.mjs'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { importJSON } from './utils/importJSON.mjs'

const { interval } = importJSON('./config.json')
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
    await main()
    setTimeout(timer, interval)
}