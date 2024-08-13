import { response, ResponseCode } from "@/config/response";
import { createPostImages, deletePostImage, getPostWithImages } from "@/db/post.dao";
import { Counter } from "@/util/counter";

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

    req.imageName = {
        prefix: `posts/${postId}/images/image_`,
        startNum: new Counter(post.images.length + 1)
    };

    return { success: true };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{}>}
 */
export async function AfterCreatePostImageService(req, res) {
    if (!req.files) {
        throw new Error("Failed to upload image");
    }

    const fileUrls = req.files.map(file => {
        if (!file.location) {
            throw new Error("Failed to upload image");
        }
        return file.location;
    });

    await createPostImages(Number(req.params.postId), fileUrls);

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
