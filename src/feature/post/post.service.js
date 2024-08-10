import { getQueryBuilder } from "@/config/db";

/**
 * @param {object} postData
 * @return {Promise<object>}
 */

export async function createPostService(postData) {
  const knex = getQueryBuilder();
  console.log('Inserting post data:', postData);
  const [id] = await knex("post").insert(postData);
  const insertedPost = { id, ...postData };
  console.log('Inserted post:', insertedPost);
  return insertedPost;
}


/**
 * @return {Promise<object[]>}
 */
export async function getPostsService() {
    const knex = getQueryBuilder();
    return await knex("post").select("*");
}

/**
 * @param {number} id
 * @return {Promise<object | null>}
 */
export async function getPostService(id) {
    const knex = getQueryBuilder();
    return await knex("post").where({ id }).first();
}

/**
 * @param {number} id
 * @param {object} updateData
 * @return {Promise<object | null>}
 */
export async function updatePostService(id, updateData) {
    const knex = getQueryBuilder();
    const affectedRows = await knex("post").where({ id }).update(updateData);
    if (affectedRows === 0) return null;
    return { id, ...updateData };
}

/**
 * @param {number} id
 * @return {Promise<boolean>}
 */
export async function deletePostService(id) {
    const knex = getQueryBuilder();
    const affectedRows = await knex("post").where({ id }).del();
    return affectedRows > 0;
}
