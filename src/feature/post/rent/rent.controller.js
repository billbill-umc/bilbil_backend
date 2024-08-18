import {
    AcceptRequestService,
    CancelAcceptService,
    CancelRequestService,
    CreateRentReviewService,
    RequestRentService
} from "@/feature/post/rent/rent.service";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function RequestRentController(req, res) {
    const response = await RequestRentService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CancelRequestController(req, res) {
    const response = await CancelRequestService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function AcceptRequestController(req, res) {
    const response = await AcceptRequestService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CancelAcceptController(req, res) {
    const response = await CancelAcceptService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreateRentReviewController(req, res) {
    const response = await CreateRentReviewService(req, res);
    res.send(response);
}
