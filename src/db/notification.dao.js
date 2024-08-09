import { getQueryBuilder } from "@/config/db";

/**
 *
 * @param {number} userId
 * @return {Promise<{id: number, targetType: string, targetId: 1, isRead: number, createdAt: Date}[]>}
 */
export async function getNotifications(userId) {
    return getQueryBuilder()("notification")
        .select("id", "targetType", "targetId", "isRead", "createdAt")
        .where("userId", "=", userId);
}

/**
 * @param {number} notificationId
 * @return {Promise<{id: number, userId: number, targetType: string, targetId: 1, isRead: number, createdAt: Date}>}
 */
export async function getNotificationById(notificationId) {
    return getQueryBuilder()("notification")
        .select("*")
        .where("id", "=", notificationId)
        .first();
}

/**
 * @param {number} notificationId
 * @return {Promise<void>}
 */
export async function updateNotificationRead(notificationId) {
    await getQueryBuilder()("notification")
        .where("id", "=", notificationId)
        .update({ isRead: 1 });
}

/**
 * @param {number} notificationId
 * @return {Promise<void>}
 */
export async function deleteNotification(notificationId) {
    await getQueryBuilder()("notification")
        .where("id", "=", notificationId)
        .delete();
}
