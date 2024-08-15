import {
    AfterCreateChattingImageService,
    BeforeCreateChattingImageService
} from "@/feature/chat/images/images.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function BeforeCreateChattingImageController(req, res, next) {
    const result = await BeforeCreateChattingImageService(req, res);

    if (!result.success) {
        return res.send(result.response);
    }

    next();
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns {Promise<void>}
 */
export async function AfterCreateChattingImageController(req, res) {
    const response = await AfterCreateChattingImageService(req, res);
    res.send(response);
}
