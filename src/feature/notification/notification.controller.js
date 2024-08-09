import {
    DeleteNotificationService,
    GetNotificationService,
    SetNotificationReadService
} from "@/feature/notification/notification.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetNotificationController(req, res) {
    const response = await GetNotificationService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function SetNotificationReadController(req, res) {
    const response = await SetNotificationReadService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeleteNotificationController(req, res) {
    const response = await DeleteNotificationService(req, res);
    res.send(response);
}
