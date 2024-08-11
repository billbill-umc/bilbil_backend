import {
    CreatePostService,
    DeletePostService,
    GetPostService,
    GetPostsService,
    UpdatePostService
} from "./post.service.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreatePostController(req, res) {
    const response = await CreatePostService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostsController(req, res) {
    const response = await GetPostsService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostController(req, res) {
    const response = await GetPostService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function UpdatePostController(req, res) {
    const response = await UpdatePostService(req, res);
    res.send(response);
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeletePostController(req, res) {
    const response = await DeletePostService(req, res);
    res.send(response);
}
