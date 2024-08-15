import zod, { ZodError } from "zod";
import { response, ResponseCode } from "@/config/response";
import { createPost, deletePost, getPostById, getPostImages, getPosts, updatePost } from "@/db/post.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreatePostService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const post = req.body;

    const postSchema = zod.object({
        itemName: zod.string(),
        description: zod.string(),
        areaCode: zod.number(),
        categoryId: zod.number(),
        price: zod.number().min(0),
        deposit: zod.number().min(0),
        itemCondition: zod.enum([ "NEW", "HIGH", "MIDDLE", "LOW" ]),
        dateBegin: zod.number(),
        dateEnd: zod.number()
    });

    try {
        postSchema.parse(req.body);
        post.dateBegin = new Date(post.dateBegin * 1000);
        if (post.dateEnd) {
            post.dateEnd = new Date(post.dateEnd * 1000);
        }
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.INVALID_POST_DATA, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const [ id ] = await createPost({ ...post, authorId: userId });

    return response(ResponseCode.SUCCESS, { createdPostId: id });
}


/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostsService(req, res) {
    const { page, size, area, category } = req.query;

    const params = { page, size, area, category };

    if (!page) {
        params.page = 1;
    } else {
        if (isNaN(Number(page))) {
            return response(ResponseCode.BAD_REQUEST, null);
        }
        params.page = Number(page);
    }

    if (!size) {
        params.size = 20;
    } else {
        if (isNaN(Number(size))) {
            return response(ResponseCode.BAD_REQUEST, null);
        }
        params.size = Number(size);
    }

    if (!area) {
        return response(ResponseCode.BAD_REQUEST, null);
    }

    params.area = area.split(",").map(Number)
        .filter(n => !isNaN(n));

    if (params.area.length < 1) {
        return response(ResponseCode.BAD_REQUEST, null);
    }

    if (!category) {
        params.category = null;
    } else {
        if (isNaN(Number(category))) {
            return response(ResponseCode.BAD_REQUEST, null);
        }
        params.category = Number(category);
    }

    const posts = (await getPosts(params)).map(post => ({
        id: post.id,
        author: {
            id: post.authorId,
            username: post.authorName,
            avatar: post.authorAvatar
        },
        itemName: post.itemName,
        description: post.description,
        condition: post.itemCondition,
        thumbnail: post.imageUrl,
        area: post.areaCode,
        price: post.price,
        deposit: post.deposit,
        createdAt: Math.floor(post.createdAt / 1000),
        updatedAt: Math.floor(post.updatedAt / 1000)
    }));

    return response(ResponseCode.SUCCESS, { posts });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostService(req, res) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const post = await getPostById(id);
    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }
    const images = await getPostImages(id);

    const postResponse = {
        id: post.id,
        author: {
            id: post.authorId,
            username: post.authorName,
            avatar: post.authorAvatar
        },
        itemName: post.itemName,
        itemCondition: post.itemCondition,
        category: post.categoryId,
        images: images.map(i => ({ id: i.id, url: i.url })),
        description: post.description,
        price: post.price,
        deposit: post.deposit,
        area: post.areaCode,
        dateBegin: Math.floor(post.dateBegin / 1000),
        dateEnd: post.dateEnd ? Math.floor(post.dateEnd / 1000) : null,
        createdAt: Math.floor(post.createdAt / 1000),
        updatedAt: Math.floor(post.updatedAt / 1000),
        isLent: false
    };

    return response(ResponseCode.SUCCESS, postResponse);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function UpdatePostService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const id = Number(req.params.id);

    if (isNaN(Number(id))) {
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const post = await getPostById(id);

    if (post.authorId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const postUpdateBodySchema = zod.object({
        itemName: zod.string().optional(),
        description: zod.string().optional(),
        price: zod.number().min(0)
            .optional(),
        deposit: zod.number().min(0)
            .optional(),
        dateBegin: zod.number().optional(),
        dateEnd: zod.number().optional(),
        itemCondition: zod.enum([ "NEW", "HIGH", "MIDDLE", "LOW" ]).optional(),
        category: zod.number().optional()
    });

    try {
        postUpdateBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.INVALID_POST_DATA, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    try {
        await updatePost(id, req.body);
        return response(ResponseCode.SUCCESS, null);
    } catch (e) {
        return response(ResponseCode.INVALID_POST_DATA, null);
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeletePostService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const id = Number(req.params.id);

    if (isNaN(Number(id))) {
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const post = await getPostById(id);

    if (!post) {
        return response(ResponseCode.INVALID_POST_ID, null);
    }

    if (post.authorId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    await deletePost(id);

    return response(ResponseCode.SUCCESS, null);
}
