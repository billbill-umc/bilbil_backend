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
 * @param {number[]} area
 * @param {number[]} category
 * @return {Promise<{id: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Data, itemCondition: string, createdAt: Date, updatedAt: Date, imageUrl: string, authorId: number, authorName: string, authorAvatar: string, rentId: number}[]>}
 */
export async function getPosts({ page, size, area, category }) {
    const query = getQueryBuilder()("post")
        .select(
            "post.id as id",
            "post.categoryId as categoryId",
            "post.areaCode as areaCode",
            "post.itemName as itemName",
            "post.price as price",
            "post.deposit as deposit",
            "post.description as description",
            "post.dateBegin as dateBegin",
            "post.dateEnd as dateEnd",
            "post.itemCondition as itemCondition",
            "post.createdAt as createdAt",
            "post.updatedAt as updatedAt",
            "postImage.url as imageUrl",
            "user.id as authorId",
            "user.username as authorName",
            "userAvatar.url as authorAvatar",
            "rent.id as rentId"
        )
        .leftJoin("postImage", function() {
            this.on("post.id", "=", "postImage.postId")
                .andOn("postImage.isDeleted", "=", 0);
        })
        .leftJoin("rent", function() {
            this.on("post.id", "=", "rent.postId")
                .andOn("rent.isCanceled", "=", 0);
        })
        .leftJoin("user", "post.authorId", "user.id")
        .leftJoin("userAvatar", function() {
            this.on("user.id", "=", "userAvatar.userId")
                .andOn("userAvatar.isDeleted", "=", 0);
        })
        .where("post.isDeleted", "=", 0)
        .where("user.isWithdraw", "=", 0);


    if (area) {
        query.whereIn("post.areaCode", area);
    }

    if (category) {
        query.whereIn("post.categoryId", category);
    }

    return query.offset((page - 1) * size)
        .limit(size);
}

/**
 * @param {number} postId
 * @return {Promise<{id: number, authorId: number, categoryId: number, areaCode: number, itemName: string, price: number, deposit: number, description: string, dateBegin: Date, dateEnd: Date, itemCondition: string, isDeleted: number, createdAt: Date, updatedAt: Date, authorName: string, authorAvatar: string, rentId: number}>}
 */
export async function getPostById(postId) {
    return getQueryBuilder()("post")
        .select(
            "post.id as id",
            "post.categoryId as categoryId",
            "post.areaCode as areaCode",
            "post.itemName as itemName",
            "post.price as price",
            "post.deposit as deposit",
            "post.description as description",
            "post.dateBegin as dateBegin",
            "post.dateEnd as dateEnd",
            "post.itemCondition as itemCondition",
            "post.createdAt as createdAt",
            "post.updatedAt as updatedAt",
            "user.id as authorId",
            "user.username as authorName",
            "userAvatar.url as authorAvatar",
            "rent.id as rentId"
        )
        .leftJoin("rent", function() {
            this.on("post.id", "=", "rent.postId")
                .andOn("rent.isCanceled", "=", 0);
        })
        .leftJoin("user", "post.authorId", "user.id")
        .leftJoin("userAvatar", function() {
            this.on("user.id", "=", "userAvatar.userId")
                .andOn("userAvatar.isDeleted", "=", 0);
        })
        .where("post.id", "=", postId)
        .where("post.isDeleted", "=", 0)
        .where("user.isWithdraw", "=", 0)
        .first();
}

export async function getPostImages(postId) {
    return getQueryBuilder()("postImage")
        .select("id", "url")
        .where("postId", "=", postId)
        .where("isDeleted", "=", 0);
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

    if (!rawPosts || rawPosts.length < 1) return;

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

export async function createPostImages(postId, urls) {
    return getQueryBuilder()("postImage")
        .insert(urls.map(url => ({ postId, url })));
}

export async function deletePostImage(imageId) {
    return getQueryBuilder()("postImage")
        .where("id", "=", imageId)
        .update({ isDeleted: 1 });
}

/**
 * @return {Promise<{id: number, name: string}[]>}
 */
export async function getPostCategories() {
    return getQueryBuilder()("category")
        .select("*");
}

/**
 * @param {number} postId
 * @param {number} userId
 * @param {Date} dateBegin
 * @param {Date} dateEnd
 */
export async function createPostRentRequest(postId, userId, dateBegin, dateEnd) {
    return getQueryBuilder()("rentRequest")
        .insert({ postId, borrowerId: userId, dateBegin, dateEnd });
}

/**
 * @param {number} postId
 * @param {number} borrowerId
 * @return {Promise<{id: number, postId: number, borrowerId: number, dateBegin: Date, dateEnd: Date, isCanceled: number, createdAt: Date}>}
 */
export async function getPostRentRequestByPostAndUser(postId, borrowerId) {
    return getQueryBuilder()("rentRequest")
        .select("*")
        .where("postId", postId)
        .where("borrowerId", borrowerId)
        .where("isCanceled", 0)
        .first();
}

/**
 * @param {number} postId
 * @param {number} borrowerId
 */
export async function cancelPostRentRequest(postId, borrowerId) {
    return getQueryBuilder()("rentRequest")
        .where("postId", postId)
        .where("borrowerId", borrowerId)
        .update({ isCanceled: 1 });
}

/**
 * @param {number} postId
 * @return {Promise<{id: number, postId: number, requestId: number, isCanceled: number, createdAt: Date}>}
 */
export async function getPostRent(postId) {
    return getQueryBuilder()("rent")
        .select("*")
        .where("postId", postId)
        .where("isCanceled", 0)
        .first();
}

/**
 * @param {number} postId
 * @param {number} requestId
 */
export async function createPostRent(postId, requestId) {
    return getQueryBuilder()("rent")
        .insert({ postId, requestId });
}

/**
 * @param {number} postId
 */
export async function cancelPostRent(postId) {
    return getQueryBuilder()("rent")
        .where("postId", postId)
        .update({ isCanceled: 1 });
}
