import zod, { ZodError } from "zod";
import { response, ResponseCode } from "@/config/response";
import { createUserAvatar, deleteUserAvatar, getUserAvatar, getUserById, updateUser } from "@/db/user.dao";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function EditUserService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const editUserBodySchema = zod.object({
        username: zod.string().min(4)
            .max(20)
            .optional(),
        phoneNumber: zod.string().regex(/^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/)
            .optional()
    });

    try {
        editUserBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }

    const o = {};
    if (req.body.username) o.username = req.body.username;
    if (req.body.phoneNumber) o.phoneNumber = req.body.phoneNumber;

    if (Object.keys(o).length < 1) return response(ResponseCode.BAD_REQUEST, null);

    await updateUser(userId, o);
    return response(ResponseCode.SUCCESS, null);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<{success: boolean, response: unknown}>}
 */
export async function BeforeCreateUserAvatarService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const u = await getUserById(userId);

    if (!u) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    const userAvatar = await getUserAvatar(userId);
    if (!userAvatar || userAvatar.length < 1) {
        req.imageName = `users/${userId}/avatar/avatar_1`;
    } else {
        req.imageName = `users/${userId}/avatar/avatar_${userAvatar.length + 1}`;
    }

    return { success: true };
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function AfterCreateUserAvatarService(req, res) {
    if (!req.file || !req.file.location) {
        throw new Error("Failed to upload user avatar");
    }

    await deleteUserAvatar(Number(req.user.aud));
    const [ id ] = await createUserAvatar(Number(req.user.aud), req.file.location);

    return response(ResponseCode.SUCCESS, { avatar: { id, url: req.file.location } });
}

export async function DeleteUserAvatarService(req, res) {
    const { user } = req;
    const userId = user.aud;

    if (!userId) {
        return { success: false, response: response(ResponseCode.UNAUTHORIZED, null) };
    }

    await deleteUserAvatar(userId);

    return response(ResponseCode.SUCCESS, null);
}
