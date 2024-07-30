import { withBuilder } from "@/config/db";

/**
 *
 * @param {number} userId
 * @return {Promise<void>}
 */
export async function getChatList(userId) {
    try {
        const builder = await withBuilder();

        const result = await builder
            .select("*")
            .from("chat")
            .where({ senderId: userId })
            .orWhere({ receiverId: userId });

        console.log(result);
    } catch (e) {
        console.error(e);
    }
}
