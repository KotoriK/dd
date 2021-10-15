import { getSpaceAccInfo } from 'bilibili-api'
import fetch from 'node-fetch'
import { StateCache } from './last_state.mjs'

export async function getInfo(userId) {
    const req = getSpaceAccInfo(userId)
    const resp = await fetch(req.url, {
        headers: req.options.headers,
    })
    const {
        data: {
            mid,name,
            live_room: {
                url, cover, title, liveStatus, roundStatus, roomid, roomStatus,
            }
        }
    } = await resp.json()
    return {
        name,
        url,
        cover,
        title,
        roomid,
        mid,
        status: (liveStatus == 1 && 'LIVE') || (roundStatus == 1 && 'ROUND') || (roomStatus == 1 && 'CLOSE') || 'END'
    }
}
export function isStatusChanged({ mid, status }) {
    const cache = StateCache.get(mid)
    if (cache) {
        return cache != status
    } else {
        return true
    }
}