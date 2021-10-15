import { readFileSync } from 'fs'
import { resolve } from 'path'
const jsonMap = new Map()
const getKey = (path) => resolve(process.cwd(), path)
export function importJSON(path) {
    const key = getKey(path)
    const cache = jsonMap.get(key)
    if (cache) {
        return cache
    } else {
        const value = JSON.parse(readFileSync(key))
        jsonMap.set(key, value)
        return value
    }
}
export function purgeCache(path) {
    return jsonMap.delete(getKey(path))
}