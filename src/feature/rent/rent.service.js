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
    await knex('lent').insert({
      postId,
      borrowerId,
      dateBegin,
      dateEnd
    });

    // 생성된 대여 요청 조회
    const newRentalRequest = await knex('lent')
      .select('*')
      .where('postId', postId)
      .andWhere('borrowerId', borrowerId)
      .andWhere('dateBegin', dateBegin)
      .andWhere('dateEnd', dateEnd)
      .first();

    return { 
      id: newRentalRequest.id, 
      postId, 
      borrowerId, 
      dateBegin, 
      dateEnd, 
      isCanceled: newRentalRequest.isCanceled, 
      createdAt: newRentalRequest.createdAt 
    };
  } catch (error) {
    console.error('Error in createRentalRequest:', error);
    throw error;
  }
}

/**
 * 대여 요청을 취소하는 함수
 * @param {number} postId - 게시물 ID
 * @param {number} borrowerId - 대출자 ID
 * @param {string} dateBegin - 대여 시작일
 * @param {string} dateEnd - 대여 종료일
 * @return {Promise<void>}
 */
export async function cancelRentalRequest(postId, borrowerId, dateBegin, dateEnd) {
  const knex = getQueryBuilder();

  try {
    // 대여 요청이 존재하는지 확인
    const rentalRequest = await knex('lent')
      .where({ postId, borrowerId, dateBegin, dateEnd })
      .first();

    if (!rentalRequest) {
      throw new Error('Rental request not found');
    }

    // 대여 요청 취소
    await knex('lent')
      .where({ postId, borrowerId, dateBegin, dateEnd })
      .update({ isCanceled: true });
  } catch (error) {
    console.error('Error cancelling rental request:', error);
    throw error;
  }
}
