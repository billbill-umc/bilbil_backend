import { GetCategoryManifestService } from "@/feature/manifest/category.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetCategoryManifestController(req, res) {
    const response = await GetCategoryManifestService();
    res.send(response);
}
