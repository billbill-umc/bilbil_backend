import { getCache } from "@/config/cache";

const CATEGORY_MANIFEST_KEY = "__CATEGORY_MANIFEST";

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 */
/**
 * @typedef {Object} CategoryManifest
 * @property {Category[]} categories
 */

/**
 * @param {CategoryManifest} manifest
 * @return {Promise<void>}
 */
export async function setCategoryManifestToCache(manifest) {
    const cache = await getCache();
    await cache.set(CATEGORY_MANIFEST_KEY, JSON.stringify(manifest));
}

/**
 * @return {Promise<CategoryManifest>}
 */
export async function getCategoryManifestFromCache() {
    const cache = await getCache();
    if (!await cache.exists(CATEGORY_MANIFEST_KEY)) return;
    return JSON.parse(await cache.get(CATEGORY_MANIFEST_KEY));
}
