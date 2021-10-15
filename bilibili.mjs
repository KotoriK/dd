import { getSpaceAccInfo } from 'bilibili-api'
import fetch from 'node-fetch'
import { StateCache } from './last_state.mjs'
import logger, { parseError } from './logger.mjs'

export async function getInfo(userId) {
    const req = getSpaceAccInfo(userId)
    const resp = await fetch(req.url, {
        headers: req.options.headers,
    })
    let dataReturn
    try {
        dataReturn = await resp.json()
        if (resp.ok) {
            const {
                data: {
                    mid,
                    name,
                    live_room: {
                        url, cover, title, liveStatus, roundStatus, roomid, roomStatus,
                    }
                }
            } = dataReturn
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
    } catch (e) {
        logger.error(`B站API数据拉取失败: ${resp.status}\nbody: ${JSON.stringify(dataReturn)}\n${parseError(e)}`)
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