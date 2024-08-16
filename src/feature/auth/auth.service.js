import { response, ResponseCode } from "@/config/response";
import zod from "zod";
import { getUserByEmail, getUserById } from "@/db/user.dao";
import { hashingPassword } from "@/util/password";
import { generateToken, verifyToken } from "@/util/jwt";
import { getCache } from "@/config/cache";

function getRefreshTokenKey(refreshToken) {
    return `__REFRESH_TOKEN_${refreshToken}`;
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetTokenService(req, res) {
    const getTokenBodySchema = zod.object({
        email: zod.string().email()
            .endsWith(".ac.kr"),
        password: zod.string()
    });

    try {
        getTokenBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof zod.ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }


    const user = await getUserByEmail(req.body.email);
    if (!user) {
        return response(ResponseCode.INVALID_EMAIL_ADDRESS, null);
    }

    const hashedPassword = await hashingPassword(req.body.password, user.salt);
    if (hashedPassword !== user.password) {
        return response(ResponseCode.INVALID_PASSWORD, null);
    }

    const accessToken = await generateToken(
        user.id, user.email, user.username, new Date(Date.now().valueOf() + (1000 * 60 * 30))
    );
    const refreshToken = await generateToken(
        user.id, user.email, user.username, new Date(Date.now().valueOf() + (1000 * 60 * 60 * 24 * 7))
    );
    const cache = await getCache();
    await cache.set(getRefreshTokenKey(refreshToken), user.id, "EX", 60 * 60 * 24 * 7);


    return response(ResponseCode.SUCCESS, { accessToken, refreshToken });
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function RefreshTokenService(req, res) {
    const tokenRefreshBodySchema = zod.object({
        refreshToken: zod.string()
    });

    try {
        tokenRefreshBodySchema.parse(req.body);
    } catch (e) {
        if (e instanceof zod.ZodError) {
            return response(ResponseCode.BAD_REQUEST, { issues: e.issues });
        }
        return response(ResponseCode.BAD_REQUEST, null);
    }
    const { refreshToken } = req.body;

    const cache = await getCache();
    if (!await cache.exists(getRefreshTokenKey(refreshToken))) {
        return response(ResponseCode.INVALID_REFRESH_TOKEN, null);
    }

    let token;
    try {
        token = await verifyToken(refreshToken);
    } catch (e) {
        return response(ResponseCode.INVALID_REFRESH_TOKEN, null);
    }

    const user = await getUserById(token.aud);

    const newAccessToken = await generateToken(
        user.id, user.email, user.username, new Date(Date.now().valueOf() + (1000 * 60 * 30))
    );
    const newRefreshToken = await generateToken(
        user.id, user.email, user.username, new Date(Date.now().valueOf() + (1000 * 60 * 60 * 24 * 7))
    );
    await cache.del(getRefreshTokenKey(refreshToken));
    await cache.set(getRefreshTokenKey(newRefreshToken), user.id, "EX", 60 * 60 * 24 * 7);

    return response(ResponseCode.SUCCESS, { accessToken: newAccessToken, refreshToken: newRefreshToken });
}
