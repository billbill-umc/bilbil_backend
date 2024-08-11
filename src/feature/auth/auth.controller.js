import { GetTokenService, RefreshTokenService } from "@/feature/auth/auth.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetTokenController(req, res) {
    const response = await GetTokenService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function RefreshTokenController(req, res) {
    const response = await RefreshTokenService(req, res);
    res.send(response);
}
