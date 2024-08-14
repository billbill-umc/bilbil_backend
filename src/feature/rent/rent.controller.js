import { createRentalRequest } from './rent.service.js';

/**
 * 대여 요청을 처리하는 컨트롤러
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @return {Promise<void>}
 */
export async function requestRentalController(req, res) {
  try {
    const { postId } = req.params; // URL에서 포스트 ID 추출

    // 사용자 인증 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const borrowerId = req.user.id; // 인증된 사용자의 ID 추출
    const { dateBegin, dateEnd } = req.body; // 요청 본문에서 데이터 추출

    const rentalRequest = await createRentalRequest(postId, borrowerId, dateBegin, dateEnd);
    res.status(201).json(rentalRequest);
  } catch (error) {
    console.error('Error creating rental request:', error);
    res.status(500).json({ error: 'Error creating rental request' });
  }
}
