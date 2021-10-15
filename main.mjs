import { send_group_msg, send_private_msg } from "./api.mjs"
import { getInfo, isStatusChanged } from "./bilibili.mjs"
import { saveState, updateState } from "./last_state.mjs"
import { importJSON } from "./utils/importJSON.mjs"
import { getCQImage } from './cq.mjs'
import logger, { parseError } from "./logger.mjs"
import { writeFileSync } from 'fs'
import {resolve} from 'path'

export async function main() {
    const { subs } = importJSON('./config.json')
    const SUBS = importJSON('./subscribe.json', { mid: [], room_id: [], info: {} })
    const { mid: mids } = SUBS
    try {
        const infoCache = {}
        for (const mid of mids) {
            const info = await getInfo(mid)
            Object.defineProperty(infoCache, mid, { value: { name: info.name, room_id: info.roomid }, enumerable: true })
            if (isStatusChanged(info)) {
                if (info.status == 'LIVE') {
                    for (const sub of subs) {
                        const msg = `${info.name}开始直播了哦\n今天的标题是：${info.title}\n${getCQImage(info.cover)}\n${info.url}`
                        if (typeof sub == 'object') {
                            /* {
                                "type": "group",
                                "id": number,
                                "subTo"?: []
                            } */
                            const { type, id, subTo } = sub
                            let msgId
                            if (!subTo || subTo.includes(mid)) {
                                msgId = await send_msg(type, id, message)
                            }
                        } else {
                            //默认认为是个人
                            msgId = await send_private_msg(sub, undefined, msg)
                        }
                        logger.info(`成功发送[${msgId}]给${sub}, "${msg}"`)
                    }
                }
                updateState(mid, info.status)
                saveState()
            }
            writeFileSync(resolve(process.cwd(), './subscribe.json'), JSON.stringify({ ...SUBS, info: infoCache }))
            /**没有改动运行需要的值所以不需要清理缓存 */
        }
    } catch (e) {
        logger.error(parseError(e))
    }
}
/**
 * 
 * @param {string} type 
 * @param {number} id 
 * @param {string} message 
 */
function send_msg(type, id, message, auto_escape) {
    if (type.toLowerCase() == 'group') {
        return send_group_msg(id, message, auto_escape)
    } else {
        return send_private_msg(id, undefined, message, auto_escape)
    }
}