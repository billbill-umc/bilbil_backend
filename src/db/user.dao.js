import { getQueryBuilder } from "@/config/db";

export async function createUser(email, id, password, salt, username, phoneNumber) {
    await getQueryBuilder()("user")
        .insert({
            email, userId: id, password, salt, username, phoneNumber
        });
}

/**
 * @param {string} email
 * @return {Promise<{id: number, email: string, userId: string, username: string, phoneNumber: string, password: string, salt: string, isWithdraw: number, createdAt: Date, updatedAt: Date}>}
 */
export async function getUserByEmail(email) {
    return getQueryBuilder()("user")
        .select("*")
        .where("email", email)
        .first();
}

/**
 * @param {number} id
 * @return {Promise<{id: number, email: string, userId: string, username: string, phoneNumber: string, password: string, salt: string, isWithdraw: number, createdAt: Date, updatedAt: Date}>}
 */
export async function getUserById(id) {
    return getQueryBuilder()("user")
        .select("*")
        .where("id", id)
        .first();
}

/**
 * @param {number} userId
 * @return {Promise<{id: number, userId: number, url: string, isDeleted: number, createdAt: Date}[]>}
 */
export async function getUserAvatar(userId) {
    return getQueryBuilder()("userAvatar")
        .select("*")
        .where("userId", userId);
}

/**
 * @param {number} userId
 */
export async function deleteUserAvatar(userId) {
    return getQueryBuilder()("userAvatar")
        .where("userId", userId)
        .update({ isDeleted: 1 });
}

/**
 * @param {number} userId
 * @param {string} url
 */
export async function createUserAvatar(userId, url) {
    return getQueryBuilder()("userAvatar")
        .insert({ userId, url });
}

/**
 *
 * @param {number} userId
 * @param {username: string, phoneNumber: string} data
 * @return {Promise<void>}
 */
export async function updateUser(userId, data) {
    return getQueryBuilder()("user")
        .where("id", userId)
        .update(data);
}
