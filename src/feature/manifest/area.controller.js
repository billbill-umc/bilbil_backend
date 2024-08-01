import { GetAreaManifestService } from "@/feature/manifest/area.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetAreaManifestController(req, res) {
    const response = await GetAreaManifestService();
    res.send(response);
}
