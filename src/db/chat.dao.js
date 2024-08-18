import { getQueryBuilder } from "@/config/db";

/**
 * @typedef {Object} Chat
 * @property {number} id
 * @property {number} senderId
 * @property {number} receiverId
 * @property {Date} createdAt
 * @property {number} postId
 * @property {string} postItemName
 * @property {number} postItemPrice
 * @property {number} postItemDeposit
 */

/**
 *
 * @param {number} userId
 * @returns {Promise<Chat[]>}
 */
export async function getChatList(userId) {
    return getQueryBuilder()("chat")
        .select(
            "chat.id as id",
            "chat.senderId as senderId",
            "chat.receiverId as receiverId",
            "chat.createdAt as createdAt",
            "post.id as postId",
            "post.itemName as postItemName",
            "post.price as postItemPrice",
            "post.deposit as postItemDeposit"
        )
        .join("post", "chat.postId", "post.id")
        .where("senderId", userId)
        .orWhere("receiverId", userId);
}

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} username
 * @property {string | null} avatarUrl
 */

/**
 * @param {number} userId
 * @return {Promise<User>}
 */
export async function getUserForChat(userId) {
    return getQueryBuilder()("user")
        .select(
            "user.id as id",
            "user.username as username",
            "userAvatar.url as avatarUrl"
        )
        .leftJoin("userAvatar", function() {
            this.on("user.id", "userAvatar.userId")
                .andOn("userAvatar.isDeleted", 0);
        })
        .where("user.id", userId)
        .first();
}

/**
 * @param {number} postId
 * @param {number} senderId
 * @param {number} receiverId
 * @return {Promise<number>}
 */
export async function createChat(postId, senderId, receiverId) {
    const result = await getQueryBuilder()("chat")
        .insert({
            postId, senderId, receiverId
        });

    return result[0];
}

/**
 *
 * @param {number} chatId
 * @return {Promise<{id: number, postId: number, senderId: number, receiverId: number, createdAt: Date, postItemName: string, postPrice: number, postDeposit: number}>}
 */
export async function getChat(chatId) {
    return getQueryBuilder()("chat")
        .select(
            "chat.id as id",
            "post.id as postId",
            "chat.senderId as senderId",
            "chat.receiverId as receiverId",
            "chat.createdAt as createdAt",
            "post.itemName as postItemName",
            "post.price as postPrice",
            "post.deposit as postDeposit"
        )
        .join("post", "chat.postId", "post.id")
        .where("chat.id", "=", chatId)
        .first();
}

/**
 * @param {chatId: number, senderId: number, type: string, content: string, createdAt: Date} message
 * @return {Promise<void>}
 */
export async function createMessage(message) {
    await getQueryBuilder()("chatMessage")
        .insert(message);
}

/**
 * @param {number} chatId
 * @return {Promise<{id: number, chatId: number, senderId: number, type: string, content: string, createdAt: Date}[]>}
 */
export async function getMessages(chatId) {
    return getQueryBuilder()("chatMessage")
        .where("chatId", "=", chatId);
}

/**
 * @param {number} chatId
 * @return {Promise<{id: number, senderId: number, receiverId: number, images: {id: number, url: string}[]}>}
 */
export async function getChatWithImageMessages(chatId) {
    const raw = await getQueryBuilder()("chat")
        .select(
            "chat.id as id",
            "chat.senderId as senderId",
            "chat.receiverId as receiverId",
            "chatImage.id as imageId",
            "chatImage.url as imageUrl"
        )
        .rightJoin("chatImage", "chat.id", "chatImage.chatId")
        .where("chat.id", "=", chatId)
        .andWhereNot("chatImage.isDeleted", 1);

    if (!raw || raw.length < 1) return;

    return {
        id: raw[0].id,
        senderId: raw[0].senderId,
        receiverId: raw[0].receiverId,
        images: raw.map(i => ({ id: i.imageId, url: i.imageUrl }))
    };
}

export async function createChatImage(chatId, url) {
    return getQueryBuilder()("chatImage")
        .insert({
            chatId, url
        });
}
