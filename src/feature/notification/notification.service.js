import { response, ResponseCode } from "@/config/response";
import {
    deleteNotification,
    getNotificationById,
    getNotifications,
    updateNotificationRead
} from "@/db/notification.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetNotificationService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const notifications = (await getNotifications(userId))
        .map(n => ({
            id: n.id,
            targetId: n.targetId,
            targetType: n.targetType,
            isRead: Boolean(n.isRead),
            notifiedAt: Math.floor(n.createdAt.valueOf() / 1000)
        }));

    return response(ResponseCode.SUCCESS, { notifications });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function SetNotificationReadService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const notificationId = Number(req.params.notificationId);

    if (isNaN(notificationId)) {
        return response(ResponseCode.INVALID_NOTIFICATION_ID, null);
    }

    const targetNotification = await getNotificationById(notificationId);

    if (!targetNotification) {
        return response(ResponseCode.INVALID_NOTIFICATION_ID, null);
    }

    if (targetNotification.userId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    await updateNotificationRead(notificationId);

    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeleteNotificationService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!user.aud) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    const notificationId = Number(req.params.notificationId);

    if (isNaN(notificationId)) {
        return response(ResponseCode.INVALID_NOTIFICATION_ID, null);
    }

    const notification = await getNotificationById(notificationId);

    if (!notification) {
        return response(ResponseCode.INVALID_NOTIFICATION_ID, null);
    }

    if (notification.userId !== userId) {
        return response(ResponseCode.UNAUTHORIZED, null);
    }

    await deleteNotification(notificationId);

    return response(ResponseCode.SUCCESS, null);
}
