import { GetChattingByIdService, GetChattingsService, PostChattingService } from "@/feature/chat/chattings.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function GetChattingsController(req, res) {
    const response = await GetChattingsService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function PostChattingController(req, res) {
    const response = await PostChattingService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function GetChattingByIdController(req, res) {
    const response = await GetChattingByIdService(req, res);
    res.send(response);
}
