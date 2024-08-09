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
 * @property {string} email
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
            "user.email as email",
            "userAvatar.url as avatarUrl"
        )
        .leftJoin("userAvatar", "user.id", "userAvatar.userId")
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
