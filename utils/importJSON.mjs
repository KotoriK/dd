import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
const jsonMap = new Map()
const getKey = (path) => resolve(process.cwd(), path)
export function importJSON(path, defaultValue = {}) {
    const key = getKey(path)
    const cache = jsonMap.get(key)
    if (cache) {
        return cache
    } else {
        try {
            const value = JSON.parse(readFileSync(key))
            jsonMap.set(key, value)
            return value
        } catch (e) {
            if (e?.code == 'ENOENT') {
                writeFileSync(key, JSON.stringify(defaultValue))
                return defaultValue
            } else {
                throw e
            }
        }
    }
}
export function purgeCache(path) {
    return jsonMap.delete(getKey(path))
}