import { getCache } from "@/config/cache";

const BASE_LAST_MESSAGE_KEY = "__CHAT_MESSAGE_LAST";

function getLastMessageKey(chatId) {
    return {
        receiver: `${BASE_LAST_MESSAGE_KEY}_${chatId}_receiver`,
        sender: `${BASE_LAST_MESSAGE_KEY}_${chatId}_sender`
    };
}

/**
 * @typedef {Object} ChatMessage
 * @property {number} id
 * @property {number} senderId
 * @property {"TEXT"|"IMAGE"} type
 * @property {string} content
 * @property {Date} createdAt
 */

/**
 * @typedef {"sender" | "receiver"} MessageUserType
 */

/**
 * @param {number} chatId
 * @param {MessageUserType} isSender
 * @param {ChatMessage} message
 * @return {Promise<void>}
 */
export async function setLastMessageToCache(chatId, isSender, message) {
    const cache = await getCache();
    const key = getLastMessageKey(chatId)[isSender ? "sender" : "receiver"];

    await cache.set(key, JSON.stringify(message));
}

/**
 * @param {number} chatId
 * @param {MessageUserType} isSender
 * @return {Promise<ChatMessage>}
 */
export async function getLastMessageFromCache(chatId, isSender) {
    const cache = await getCache();
    const key = getLastMessageKey(chatId)[isSender ? "sender" : "receiver"];

    if (!await cache.exists(key)) {
        return;
    }

    const message = await cache.get(key);
    return JSON.parse(message);
}
