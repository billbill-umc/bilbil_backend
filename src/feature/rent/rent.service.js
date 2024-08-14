import { getQueryBuilder } from '@/config/db';

/**
 * 대여 요청을 생성하는 함수
 * @param {number} postId - 게시물 ID
 * @param {number} borrowerId - 대출자 ID
 * @param {string} dateBegin - 대여 시작일
 * @param {string} dateEnd - 대여 종료일
 * @return {Promise<object>} - 생성된 대여 요청 객체
 */
export async function createRentalRequest(postId, borrowerId, dateBegin, dateEnd) {
  const knex = getQueryBuilder();
  try {
      // 게시물 존재 여부 확인
      const post = await knex('post').where({ id: postId }).first();
      if (!post) {
          throw new Error(`Post with id ${postId} does not exist`);
      }

      // 대여 요청 생성
      const [id] = await knex('lent').insert({
          postId,
          borrowerId,  // 올바르게 설정된 borrowerId
          dateBegin,
          dateEnd
      }).returning('id');  // 생성된 ID를 반환

      return { id, postId, borrowerId, dateBegin, dateEnd, isCanceled: false, createdAt: new Date() };
  } catch (error) {
      console.error('Error in createRentalRequest:', error);
      throw error;
  }
}
