import { getQueryBuilder } from "@/config/db";

/**
 * @param {authorId: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Date, itemCondition: string} post
 * @return {Promise<number>}
 */
export async function createPost(post) {
    return getQueryBuilder()("post")
        .insert(post);
}

/**
 * @param {number} page
 * @param {number} size
 * @param {number} area
 * @param {number} category
 * @return {Promise<{id: number, authorId: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Date, itemCondition: string, isDeleted: number, createdAt: Date, updatedAt: Date}[]>}
 */
export async function getPosts({ page, size, area, category }) {
    const query = getQueryBuilder()("post");

    query.offset((page - 1) * size)
        .limit(size)
        .whereIn("areaCode", area)
        .andWhereNot("isDeleted", 1);

    if (category) {
        query.andWhere("categoryId", category);
    }

    return query.select("*");
}

/**
 * @param {number} postId
 * @return {Promise<{id: number, authorId: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Date, itemCondition: string, isDeleted: number, createdAt: Date, updatedAt: Date}>}
 */
export async function getPostById(postId) {
    return getQueryBuilder()("post")
        .select("*")
        .where("id", postId)
        .andWhereNot("isDeleted", 1)
        .first();
}

/**
 * @param {number} postId
 * @return {Promise<{id: number, authorId: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Date, itemCondition: string, createdAt: Date, updatedAt: Date, images: {id: number, url: string, createdAt: Date}[]}>}
 */
export async function getPostWithImages(postId) {
    const rawPosts = await getQueryBuilder()("post")
        .select(
            "post.id as id",
            "post.authorId as authorId",
            "post.categoryId as categoryId",
            "post.areaCode as areaCode",
            "post.itemName as itemName",
            "post.price as price",
            "post.deposit as deposit",
            "post.description as description",
            "post.dateBegin as dateBegin",
            "post.dateEnd as dateEnd",
            "post.itemCondition as itemCondition",
            "post.isDeleted as isDeleted",
            "post.createdAt as createdAt",
            "post.updatedAt as updatedAt",
            "postImage.id as imageId",
            "postImage.url as imageUrl",
            "postImage.createdAt as imageCreatedAt",
            "postImage.isDeleted as imageIsDeleted"
        )
        .rightJoin("postImage", "post.id", "postImage.postId")
        .where("post.id", "=", postId)
        .andWhereNot("post.isDeleted", 1)
        .andWhereNot("postImage.isDeleted", 1);

    if (!rawPosts) return;

    const post = {
        id: rawPosts[0].id,
        authorId: rawPosts[0].authorId,
        categoryId: rawPosts[0].categoryId,
        areaCode: rawPosts[0].areaCode,
        itemName: rawPosts[0].itemName,
        price: rawPosts[0].price,
        deposit: rawPosts[0].deposit,
        description: rawPosts[0].description,
        dateBegin: rawPosts[0].dateBegin,
        dateEnd: rawPosts[0].dateEnd,
        itemCondition: rawPosts[0].itemCondition,
        createdAt: rawPosts[0].createdAt,
        updatedAt: rawPosts[0].updatedAt,
        images: []
    };

    rawPosts.map(p => {
        post.images.push({
            id: p.imageId,
            url: p.imageUrl,
            createdAt: p.imageCreatedAt
        });
    });

    return post;
}

/**
 * @param {number} postId
 * @param {{itemName: string, description: string, price: number, deposit: number, dateBegin: Date, dateEnd: Date, itemCondition: string, category: number}} post
 * @return {Promise<void>}
 */
export async function updatePost(postId, post) {
    return getQueryBuilder()("post")
        .where("id", postId)
        .update(post);
}

/**
 * @param {number} postId
 * @return {Promise<void>}
 */
export async function deletePost(postId) {
    return getQueryBuilder()("post")
        .where("id", postId)
        .update({ isDeleted: 1 });
}

/**
 * @param {number} postId
 * @param {string} url
 * @return {Promise<{}>}
 */
export async function createPostImage(postId, url) {
    return getQueryBuilder()("postImage")
        .insert({
            postId, url
        });
}

export async function deletePostImage(imageId) {
    return getQueryBuilder()("postImage")
        .where("id", "=", imageId)
        .update({ isDeleted: 1 });
}
