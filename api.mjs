import fetch from 'node-fetch'
import { stringify } from 'query-string'
import { importJSON } from './utils/importJSON.mjs'
const { host, port, accessToken } = importJSON('./config.json')
/**
 * 
 * @param {number} user_id 
 * @param {number} group_id 
 * @param {string} message 
 * @param {boolean} auto_escape 
 * @returns {Promise<number>}
 */
export const send_private_msg = (user_id, group_id, message, auto_escape = false) => fetch(getBaseUrl() + '/send_private_msg?' + stringify({ user_id, group_id, message, auto_escape })).then((resp)=>resp.text())
/**
 * 
 * @param {number} group_id 
 * @param {string} message 
 * @param {boolean} auto_escape 
 * @returns {Promise<number>}
 */
export const send_group_msg = (group_id, message, auto_escape = false) => fetch(getBaseUrl() + '/send_group_msg?' + stringify({  group_id, message, auto_escape })).then((resp)=>resp.text())

export const authHeader = () => {
    return {
        Authorization: 'Bearer ' + accessToken
    }
}
export const getBaseUrl = () => `http://${host}:${port}`
