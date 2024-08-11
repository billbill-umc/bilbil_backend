import { response, ResponseCode } from "@/config/response";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function WithAuthService() {
    return response(ResponseCode.SUCCESS, "with-auth");
}