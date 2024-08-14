import {
    AfterCreateUserAvatarService,
    BeforeCreateUserAvatarService,
    DeleteUserAvatarService,
    EditUserService
} from "@/feature/user/user.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function EditUserController(req, res) {
    const response = await EditUserService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function BeforeCreateUserAvatarController(req, res, next) {
    const result = await BeforeCreateUserAvatarService(req, res);

    if (!result.success) {
        return res.send(result.response);
    }

    next();
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function AfterCreateUserAvatarController(req, res) {
    const response = await AfterCreateUserAvatarService(req, res);
    res.send(response);
}

export async function DeleteUserAvatarController(req, res) {
    const response = await DeleteUserAvatarService(req, res);
    res.send(response);
}
