import {
    AfterCreatePostImageService,
    BeforeCreatePostImageService,
    DeletePostImageService
} from "@/feature/post/images/images.service";

export async function BeforeCreatePostImageController(req, res, next) {
    try {
        const result = await BeforeCreatePostImageService(req, res);

        if (!result.success) {
            return res.send(result.response);
        }
    } catch (e) {
        console.log(e);
    }


    next();
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function AfterCreatePostImageController(req, res) {
    const response = await AfterCreatePostImageService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeletePostImageController(req, res) {
    const response = await DeletePostImageService(req, res);
    res.send(response);
}
