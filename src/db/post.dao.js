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
