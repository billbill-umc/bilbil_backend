import { getCache } from "@/config/cache";

const AREA_MANIFEST_KEY = "__AREA_MANIFEST";

/**
 * @typedef {Object} Area
 * @property {string} name
 * @property {number} code
 * @property {(Area[] | null)} childArea
 */
/**
 * @typedef {Object} AreaManifest
 * @property {string} version
 * @property {Area[]} area
 */

/**
 * Save area manifest as string to cache
 * @param {AreaManifest} manifest
 * @return {Promise<void>}
 */
export async function setAreaManifestToCache(manifest) {
    const cache = await getCache();
    await cache.set(AREA_MANIFEST_KEY, JSON.stringify(manifest));
}

/**
 * Get area manifest from cache
 * @return {Promise<AreaManifest | undefined>}
 */
export async function getAreaManifestFromCache() {
    const cache = await getCache();
    if (!await cache.exists(AREA_MANIFEST_KEY)) return;
    return JSON.parse(await cache.get(AREA_MANIFEST_KEY));
}
