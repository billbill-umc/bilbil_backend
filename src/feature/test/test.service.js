import { response, ResponseCode } from "@/config/response";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetTestService(req, res) {
    return response(ResponseCode.SUCCESS, null);
}
