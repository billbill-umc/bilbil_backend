import { response, ResponseCode } from "@/config/response";
import { createPostImage, deletePostImage, getPostWithImages } from "@/db/post.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{success: boolean, response: unknown}>}
 */
export async function BeforeCreatePostImageService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return { success: false, response: response(ResponseCode.INVALID_POST_ID, null) };
    }

    const post = await getPostWithImages(postId);
    if (!post) {
        return { success: false, response: response(ResponseCode.INVALID_POST_ID, null) };
    }

    if (post.authorId !== userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    req.imageName = `posts/${postId}/images/image_${post.images.length + 1}`;

    return { success: true };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{}>}
 */
export async function AfterCreatePostImageService(req, res) {
    const fileUrl = req?.file?.location;
    if (!fileUrl) throw new Error("Failed to upload image");

    await createPostImage(Number(req.params.postId), fileUrl);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{}>}
 */
export async function DeletePostImageService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const postId = Number(req.params.postId);
    const imageId = Number(req.params.imageId);

    if (isNaN(postId)) return response(ResponseCode.INVALID_POST_ID, null);
    if (isNaN(imageId)) return response(ResponseCode.INVALID_IMAGE_ID, null);

    const post = await getPostWithImages(postId);
    if (!post) return response(ResponseCode.INVALID_POST_ID, null);

    if (!post.images.find(i => i.id === imageId)) return response(ResponseCode.INVALID_IMAGE_ID, null);

    if (post.authorId !== userId) return response(ResponseCode.UNAUTHORIZED, null);

    await deletePostImage(imageId);

    return response(ResponseCode.SUCCESS, null);
}
