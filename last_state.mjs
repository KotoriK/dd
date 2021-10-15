import { writeFile } from 'fs/promises'
import { importJSON, purgeCache } from './utils/importJSON.mjs'
import { resolve } from 'path'
import logger,{parseError} from './logger.mjs'
/**
 * @type {Map<number,string>} mid,live_status
 */
export let StateCache = new Map()
try {
    const last_state = importJSON('./cache/last_state.json',[])
    StateCache = new Map(last_state)
}
catch (e) {
    logger.error(parseError(e))
}
/**
 * @param {Array<[number,boolean]>} state
 */
export function saveState() {
    purgeCache('./cache/last_state.json')
    return writeFile(resolve(process.cwd(), './cache/last_state.json'), JSON.stringify(Array.from(StateCache.entries())))
}
export function updateState(mid,status){
    StateCache.set(mid,status)
}
