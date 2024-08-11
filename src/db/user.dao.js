import { getQueryBuilder } from "@/config/db";

export async function createUser(email, id, password, salt, username, phoneNumber) {
    await getQueryBuilder()("user")
        .insert({
            email, userId: id, password, salt, username, phoneNumber
        });
}
