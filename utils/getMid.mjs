import { getRoomPlayInfo } from 'bilibili-api'
import fetch from 'node-fetch'
import { writeFile } from 'fs/promises'
import Path from 'path'
import { importJSON, purgeCache } from './importJSON.mjs'
async function getMid(room_id) {
    const { url, options: { headers } } = getRoomPlayInfo(room_id)
    const resp = await fetch(url, { headers })
    const { data: { uid } } = await resp.json()
    console.log(`${room_id}->${uid}:success`)
    return uid
}
async function main() {
    const SUBS = importJSON('./subscribe.json')
    const { room_id, mid } = SUBS
    const results = await Promise.allSettled(room_id.map(async item => [item, await getMid(item)]))
    const successResult = results.filter(result => result.status == "fulfilled")
    const failedResult = results.filter(result => result.status == "rejected")
    console.error(...failedResult)
    const newMid = [...mid, ...successResult.map(result => result.value[1])]
    const newSubs = {
        room_id: failedResult.map(result => result.value[0]),
        mid: newMid
    }
    purgeCache('./subscribe.json')
    return writeFile(Path.resolve(process.cwd(), './subscribe.json'), JSON.stringify(newSubs))
}
main().then(() => console.log('JOB DONE.'), console.error)