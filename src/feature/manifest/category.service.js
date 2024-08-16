import { getCategoryManifestFromCache, setCategoryManifestToCache } from "@/cache/category-manifest";
import { getPostCategories } from "@/db/post.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetCategoryManifestService(req, res) {
    let categories = await getCategoryManifestFromCache();

    if (!categories) {
        categories = await getPostCategories();
        await setCategoryManifestToCache({ categories });
    }

    return categories;
}
