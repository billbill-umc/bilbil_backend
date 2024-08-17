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
    const [newRequestId] = await knex('rentRequest').insert({
      postId,
      borrowerId,
      dateBegin,
      dateEnd,
      isCanceled: false
    });

    // 생성된 대여 요청 ID 가져오기
    const insertedId = await knex('rentRequest').where({
      postId,
      borrowerId,
      dateBegin,
      dateEnd,
      isCanceled: false
    }).select('id').orderBy('createdAt', 'desc').first();

    return { 
      message: '대여 요청이 성공적으로 생성되었습니다.',
      request: {
        id: insertedId.id, 
        postId, 
        borrowerId, 
        dateBegin, 
        dateEnd, 
        isCanceled: false,
        createdAt: new Date() 
      }
    };
  } catch (error) {
    console.error('Error in createRentalRequest:', error);
    throw error;
  }
}

/**
 * 대여 요청을 취소하는 서비스 함수
 * @param {number} requestId - 대여 요청 ID
 * @param {number} borrowerId - 대출자 ID
 * @return {Promise<void>}
 */
export async function cancelRentalRequest(requestId, borrowerId) {
  const knex = getQueryBuilder();

  try {
    // 대여 요청 존재 여부 확인
    console.log('Cancelling request with ID:', requestId, 'and Borrower ID:', borrowerId);

    const rentalRequest = await knex('rentRequest')
      .where('id', requestId)
      .andWhere('borrowerId', borrowerId)
      .first();

    if (!rentalRequest) {
      throw new Error('대여 요청을 찾을 수 없습니다.');
    }

    // 대여 요청 취소 상태로 업데이트
    await knex('rentRequest')
      .where('id', requestId)
      .andWhere('borrowerId', borrowerId)
      .update({ isCanceled: true });

    return { message: '대여 요청이 성공적으로 취소되었습니다.' };
  } catch (error) {
    console.error('Error in cancelRentalRequest:', error.message);
    throw error; // 컨트롤러에서 처리할 수 있도록 다시 던짐
  }
}


/**
 * 대여 요청을 수락하는 함수
 * @param {number} postId - 게시물 ID
 * @param {number} requestId - 대여 요청 ID
 * @return {Promise<object>} - 수락된 대여 요청 객체
 */
export async function acceptRentalRequest(postId, requestId) {
  const knex = getQueryBuilder();

  try {
    // 대여 요청 존재 여부 확인
    const rentalRequest = await knex('rentRequest')
      .where({ id: requestId, postId, isCanceled: false })
      .first();

    if (!rentalRequest) {
      throw new Error('대여 요청을 찾을 수 없거나 이미 취소되었습니다.');
    }

    // 대여 생성 - 여기서 requestId를 사용하여 rent 테이블에 삽입합니다.
    const [newRentId] = await knex('rent').insert({
      postId,
      requestId,
      isCanceled: false
    });

    // 수락된 대여 조회
    const acceptedRent = await knex('rent')
      .select('*')
      .where('id', newRentId)
      .first();

    return { 
      message: '대여 요청이 성공적으로 수락되었습니다.',
      request: {
        id: acceptedRent.id, 
        postId, 
        requestId, 
        isCanceled: acceptedRent.isCanceled, 
        createdAt: acceptedRent.createdAt 
      }
    };
  } catch (error) {
    console.error('Error in acceptRentalRequest:', error);
    throw error;
  }
}

/**
 * 대여 요청 수락을 취소하는 함수
 * @param {number} postId - 게시물 ID
 * @param {number} requestId - 대여 요청 ID
 * @return {Promise<void>}
 */
export async function cancelAcceptedRentalRequest(postId, requestId) {
  const knex = getQueryBuilder();

  try {
    await knex.transaction(async (trx) => {
      // 이미 수락된 대여 요청이 있는지 확인
      const rental = await trx('rent')
        .where({ postId, requestId, isCanceled: false })
        .first();

      if (!rental) {
        throw new Error('수락된 대여 요청을 찾을 수 없습니다.');
      }

      // 대여 요청 수락 취소 (isCanceled를 true로 업데이트)
      await trx('rent')
        .where({ id: rental.id })
        .update({ isCanceled: true });

      return { message: '대여 요청 수락이 성공적으로 취소되었습니다.' };
    });
  } catch (error) {
    console.error('Error in cancelAcceptedRentalRequest:', error.message);
    throw error;
  }
}

