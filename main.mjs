import { send_private_msg } from "./api.mjs"
import { getInfo, isStatusChanged } from "./bilibili.mjs"
import { saveState, updateState } from "./last_state.mjs"
import { importJSON } from "./utils/importJSON.mjs"
import { getCQImage } from './cq.mjs'
import logger, { parseError } from "./logger.mjs"

export async function main() {
    const { subs } = importJSON('./config.json')
    const SUBS = importJSON('./subscribe.json', { mid: [], room_id: [] })
    const { mid: mids } = SUBS
    try {
        for (const mid of mids) {
            const info = await getInfo(mid)
            if (isStatusChanged(info)) {
                if (info.status == 'LIVE') {
                    for (const sub of subs) {
                        const msg = `${info.name}开始直播了哦\n今天的标题是：${info.title}\n${getCQImage(info.cover)}\n${info.url}`
                        const msgId = await send_private_msg(sub, undefined, msg)
                        logger.info(`成功发送[${msgId}]给${sub}, "${msg}"`)
                    }
                }
                updateState(mid, info.status)
                saveState()
            }
        }
    } catch (e) {
        logger.error(parseError(e))
    }
}
