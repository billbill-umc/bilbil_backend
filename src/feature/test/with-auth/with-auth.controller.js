import { WithAuthService } from "@/feature/test/with-auth/with-auth.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function WithAuthController(req, res) {
    const body = await WithAuthService(req, res);

    res.send(body);
}
