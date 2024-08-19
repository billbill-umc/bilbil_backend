import zod, { ZodError } from "zod";
import { response, ResponseCode } from "@/config/response";
import {
    createUserAvatar,
    deleteUserAvatar,
    getUserAvatar,
    getUserById,
    getUserWithAvatar,
    updateUser
} from "@/db/user.dao";
import { getFavoritesByUserId, getPostRentReviewsByUserId, getPostsByAuthorId } from "@/db/post.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function EditUserService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const editUserBodySchema = zod.object({
        username: zod.string().min(4)
            .max(20)
            .optional(),
        phoneNumber: zod.string().regex(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/)
            .optional()
    });

    try {
        editUserBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const o = {};
    if (req.body.username) o.username = req.body.username;
    if (req.body.phoneNumber) o.phoneNumber = req.body.phoneNumber;

    if (Object.keys(o).length < 1) return response(ResponseCode.BAD_REQUEST, null);

    await updateUser(userId, o);
    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{success: boolean, response: unknown}>}
 */
export async function BeforeCreateUserAvatarService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const u = await getUserById(userId);

    if (!u) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const userAvatar = await getUserAvatar(userId);
    if (!userAvatar || userAvatar.length < 1) {
        req.imageName = `users/${userId}/avatar/avatar_1`;
    } else {
        req.imageName = `users/${userId}/avatar/avatar_${userAvatar.length + 1}`;
    }

    return { success: true };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function AfterCreateUserAvatarService(req, res) {
    if (!req.file || !req.file.location) {
        throw new Error("Failed to upload user avatar");
    }

    await deleteUserAvatar(Number(req.user.aud));
    const [ id ] = await createUserAvatar(Number(req.user.aud), req.file.location);

    return response(ResponseCode.SUCCESS, { avatar: { id, url: req.file.location } });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeleteUserAvatarService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    await deleteUserAvatar(userId);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {number} [uid]
 * @return {Promise<unknown>}
 */
export async function GetUserProfileService(req, res) {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
        return response(ResponseCode.INVALID_USER_ID, null);
    }

    const basicData = await getUserWithAvatar(userId);
    const posts = await getPostsByAuthorId(userId);
    const reviews = await getPostRentReviewsByUserId(userId);

    const result = {
        id: basicData.id,
        email: basicData.email,
        username: basicData.username,
        avatar: basicData.avatar,
        registeredAt: Math.round(basicData.createdAt.valueOf() / 1000),
        posts: posts.map(p => ({
            id: p.id,
            categoryId: p.categoryId,
            areaCode: p.areaCode,
            itemName: p.itemName,
            price: p.price,
            deposit: p.deposit,
            description: p.description,
            itemCondition: p.itemCondition,
            createdAt: Math.round(p.createdAt.valueOf() / 1000)
        })),
        reviews: posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).map(p => ({
            id: p.reviewId,
            post: {
                id: p.id,
                categoryId: p.categoryId,
                areaCode: p.areaCode,
                itemName: p.itemName,
                price: p.price,
                deposit: p.deposit,
                description: p.description,
                itemCondition: p.itemCondition,
                createdAt: Math.round(p.createdAt.valueOf() / 1000)
            },
            rating: p.reviewRating,
            content: p.reviewContent
        })),
        reviewRating: Number(
            (posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).map(p => p.reviewRating)
                .reduce((a, b) => a + b, 0) / posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).length)
                .toFixed(2)
        ),
        writtenReviews: reviews.map(r => ({
            id: r.reviewId,
            rating: r.reviewRating,
            content: r.reviewContent,
            post: {
                id: r.id,
                categoryId: r.categoryId,
                areaCode: r.areaCode,
                itemName: r.itemName,
                price: r.price,
                deposit: r.deposit,
                description: r.description,
                itemCondition: r.itemCondition
            }
        }))
    };

    return response(ResponseCode.SUCCESS, result);
}

export async function GetCurrentUserProfileService(req, res) {
    const { user } = req;
    const userId = user.aud;
    if (!userId) return response(ResponseCode.UNAUTHORIZED, null);

    const basicData = await getUserWithAvatar(userId);
    const posts = await getPostsByAuthorId(userId);
    const reviews = await getPostRentReviewsByUserId(userId);
    const favorites = await getFavoritesByUserId(userId);

    const result = {
        id: basicData.id,
        email: basicData.email,
        username: basicData.username,
        avatar: basicData.avatar,
        registeredAt: Math.round(basicData.createdAt.valueOf() / 1000),
        posts: posts.map(p => ({
            id: p.id,
            categoryId: p.categoryId,
            areaCode: p.areaCode,
            itemName: p.itemName,
            price: p.price,
            deposit: p.deposit,
            description: p.description,
            itemCondition: p.itemCondition,
            createdAt: Math.round(p.createdAt.valueOf() / 1000)
        })),
        reviews: posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).map(p => ({
            id: p.reviewId,
            post: {
                id: p.id,
                categoryId: p.categoryId,
                areaCode: p.areaCode,
                itemName: p.itemName,
                price: p.price,
                deposit: p.deposit,
                description: p.description,
                itemCondition: p.itemCondition,
                createdAt: Math.round(p.createdAt.valueOf() / 1000)
            },
            rating: p.reviewRating,
            content: p.reviewContent
        })),
        reviewRating: Number(
            (posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).map(p => p.reviewRating)
                .reduce((a, b) => a + b, 0) / posts.filter(p => p.reviewId && p.reviewRating && p.reviewContent).length)
                .toFixed(2)
        ),
        writtenReviews: reviews.map(r => ({
            id: r.reviewId,
            rating: r.reviewRating,
            content: r.reviewContent,
            post: {
                id: r.id,
                categoryId: r.categoryId,
                areaCode: r.areaCode,
                itemName: r.itemName,
                price: r.price,
                deposit: r.deposit,
                description: r.description,
                itemCondition: r.itemCondition
            }
        })),
        favorites: favorites.map(f => ({
            id: f.id,
            categoryId: f.categoryId,
            areaCode: f.areaCode,
            itemName: f.itemName,
            author: {
                id: f.authorId,
                username: f.authorName,
                avatar: f.authorAvatar
            },
            price: f.price,
            deposit: f.deposit,
            description: f.description,
            itemCondition: f.itemCondition,
            createdAt: Math.round(f.createdAt.valueOf() / 1000),
            updatedAt: Math.round(f.updatedAt.valueOf() / 1000)
        }))
    };
    return response(ResponseCode.SUCCESS, result);
}
