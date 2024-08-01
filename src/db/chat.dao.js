import { getQueryBuilder } from "@/config/db";


export async function getChatList(userId) {
    return getQueryBuilder()("chat").select("*")
        .where("senderId", userId)
        .orWhere("receiverId", userId);
}
