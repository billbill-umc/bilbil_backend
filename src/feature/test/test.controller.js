import { GetTestService } from "@/feature/test/test.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetTestController(req, res) {
    const response = await GetTestService(req, res);
    res.send(response);
}
