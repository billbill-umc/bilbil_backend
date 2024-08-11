import { getQueryBuilder } from '@/config/db';

/**
 * @param {number} postId
 * @param {number} borrowerId
 * @param {string} dateBegin
 * @param {string} dateEnd
 * @return {Promise<object>}
 */

export async function createRentalRequest(postId, borrowerId, dateBegin, dateEnd) {
  const knex = getQueryBuilder();
  try {
      // Check if postId exists in post table
      const post = await knex('post').where({ id: postId }).first();
      if (!post) {
          throw new Error(`Post with id ${postId} does not exist`);
      }

      const [id] = await knex('lent').insert({
          postId,
          borrowerId,
          dateBegin,
          dateEnd
      });
      return { id, postId, borrowerId, dateBegin, dateEnd, isCanceled: false, createdAt: new Date() };
  } catch (error) {
      console.error('Error in createRentalRequest:', error);
      throw error;
  }
}