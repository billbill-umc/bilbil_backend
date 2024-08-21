import { response, ResponseCode } from "@/config/response";
import { createFavorite, deleteFavorite, getFavorite, getPostById } from "@/db/post.dao";
import notificationManager from "@/feature/notification/notification.manager";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<unknown>}
 */
export async function DoFavoriteService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    if (!req.params.postId || isNaN(Number(req.params.postId))) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const post = await getPostById(Number(req.params.postId));
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const favorite = await getFavorite(post.id, userId);
    let beingFavorite = false;
    if (!favorite) {
        beingFavorite = true;
        await createFavorite(post.id, userId);
        notificationManager.newFavoriteNotification(post.authorId, post.id).then();
    } else {
        await deleteFavorite(post.id, userId);
    }

    return response(ResponseCode.SUCCESS, { isFavorite: beingFavorite });
}
