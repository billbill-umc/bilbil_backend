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
    try {
        const response = await CreatePostService(req, res);
        res.send(sanitize(response));
    } catch (error) {
        res.status(500).send('An error occurred while creating the post.');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostsController(req, res) {
    try {
        const response = await GetPostsService(req, res);
        res.send(sanitize(response));
    } catch (error) {
        res.status(500).send('An error occurred while retrieving posts.');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostController(req, res) {
    try {
        const response = await GetPostService(req, res);
        res.send(sanitize(response));
    } catch (error) {
        res.status(500).send('An error occurred while retrieving the post.');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function UpdatePostController(req, res) {
    try {
        const response = await UpdatePostService(req, res);
        res.send(sanitize(response));
    } catch (error) {
        res.status(500).send('An error occurred while updating the post.');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeletePostController(req, res) {
    try {
        const response = await DeletePostService(req, res);
        res.send(sanitize(response));
    } catch (error) {
        res.status(500).send('An error occurred while deleting the post.');
    }
}

// Helper function to sanitize data
function sanitize(data) {
    // Implement a proper sanitization logic here
    return data; // Placeholder for actual sanitization logic
}
