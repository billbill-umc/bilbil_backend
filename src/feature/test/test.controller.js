import { createPostService, getPostsService, getPostService, updatePostService, deletePostService } from './post.service.js';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function createPostController(req, res) {
  try {
    const postData = req.body;
    console.log('Received post data:', postData);
    const newPost = await createPostService(postData);
    console.log('New post created:', newPost);
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: "Error creating post" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function getPostsController(req, res) {
  try {
    const posts = await getPostsService();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching posts" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function getPostController(req, res) {
  try {
    const { id } = req.params;
    const post = await getPostService(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching post" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function updatePostController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedPost = await updatePostService(id, updateData);
    if (updatedPost) {
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating post" });
  }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function deletePostController(req, res) {
  try {
    const { id } = req.params;
    const success = await deletePostService(id);
    if (success) {
      res.status(200).json({ message: "Post deleted" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting post" });
  }
}
