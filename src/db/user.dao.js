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
