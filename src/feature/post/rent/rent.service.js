import { response, ResponseCode } from "@/config/response";
import {
    cancelPostRent,
    cancelPostRentRequest,
    createPostRent,
    createPostRentRequest,
    createPostRentReview,
    getPostById,
    getPostRent,
    getPostRentByBorrowerId,
    getPostRentRequestByPostAndUser,
    getPostRentReview
} from "@/db/post.dao";
import zod, { ZodError } from "zod";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function RequestRentService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const post = await getPostById(postId);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const rent = await getPostRent(postId);
    if (rent) {
        return response(ResponseCode.ALREADY_LENT, null);
    }

    const rentRequestBodySchema = zod.object({
        dateBegin: zod.number(),
        dateEnd: zod.number()
    });

    try {
        rentRequestBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        return response(ResponseCode.BAD_REQUEST, null);
    }

    await cancelPostRentRequest(postId, userId);

    const [ id ] = await createPostRentRequest(
        postId, userId, new Date(req.body.dateBegin * 1000), new Date(req.body.dateEnd * 1000)
    );

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<unknown>}
 */
export async function CancelRequestService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const post = await getPostById(postId);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    await cancelPostRentRequest(postId, userId);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<unknown>}
 */
export async function AcceptRequestService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }
    const post = await getPostById(postId);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const acceptRequestBodySchema = zod.object({
        targetUserId: zod.number()
    });

    try {
        acceptRequestBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const rentRequest = await getPostRentRequestByPostAndUser(postId, req.body.targetUserId);
    if (!rentRequest) {
        return response(ResponseCode.INVALID_RENT_REQUEST, null);
    }
    const rent = await getPostRent(postId);
    if (rent) {
        return response(ResponseCode.ALREADY_LENT, null);
    }

    await createPostRent(postId, rentRequest.id);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<unknown>}
 */
export async function CancelAcceptService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }
    const post = await getPostById(postId);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    if (post.authorId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const rent = await getPostRent(postId);
    if (!rent) {
        return response(ResponseCode.INVALID_RENT_REQUEST, null);
    }

    await cancelPostRent(postId);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<unknown>}
 */
export async function CreateRentReviewService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postId = Number(req.params.postId);
    if (isNaN(postId)) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }
    const post = await getPostById(postId);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    const rent = await getPostRentByBorrowerId(postId, userId);
    if (!rent) {
        return response(ResponseCode.INVALID_RENT_REQUEST, null);
    }

    const review = await getPostRentReview(postId, userId);
    if (review) {
        return response(ResponseCode.ALREADY_REVIEWED, null);
    }

    const reviewRequestBodySchema = zod.object({
        rating: zod.number().min(1)
            .max(5),
        content: zod.string()
    });

    try {
        reviewRequestBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        return response(ResponseCode.BAD_REQUEST, null);
    }

    await createPostRentReview(rent.postId, userId, req.body.rating, req.body.content);

    return response(ResponseCode.SUCCESS, null);
}
