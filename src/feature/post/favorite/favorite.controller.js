import { DoFavoriteService } from "@/feature/post/favorite/favorite.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DoFavoriteController(req, res) {
    const response = await DoFavoriteService(req, res);
    res.send(response);
}
