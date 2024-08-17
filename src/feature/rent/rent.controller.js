import { createRentalRequest, cancelRentalRequest, acceptRentalRequest, cancelAcceptedRentalRequest } from './rent.service.js';

/**
 * 대여 요청을 처리하는 컨트롤러
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @return {Promise<void>}
 */
export async function requestRentalController(req, res) {
  try {
    const { postId } = req.params;
    const { dateBegin, dateEnd } = req.body;

    // 사용자 인증 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const borrowerId = req.user.id;

    // 대여 요청 생성
    const rentalRequest = await createRentalRequest(postId, borrowerId, dateBegin, dateEnd);
    res.status(201).json(rentalRequest);
  } catch (error) {
    console.error('Error creating rental request:', error);
    res.status(500).json({ error: 'Error creating rental request' });
  }
}

/**
 * 대여 요청 취소 컨트롤러
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @return {Promise<void>}
 */
export async function cancelRentalRequestController(req, res) {
  try {
    const { requestId } = req.params;

    // 사용자 인증 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const borrowerId = req.user.id;

    // 대여 요청 취소
    await cancelRentalRequest(requestId, borrowerId);
    res.status(204).send(); // 성공 시 빈 응답 전송
  } catch (error) {
    console.error('Error cancelling rental request:', error.message);
    res.status(500).json({ error: error.message || 'Error cancelling rental request' });
  }
}

/**
 * 대여 요청을 수락하는 컨트롤러
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @return {Promise<void>}
 */
export async function acceptRentalRequestController(req, res) {
  try {
    const { postId, requestId } = req.params;

    // 사용자 인증 확인
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const borrowerId = req.user.id;

    // 대여 요청 수락
    const rentalRequest = await acceptRentalRequest(postId, requestId);
    res.status(200).json(rentalRequest);
  } catch (error) {
    console.error('Error accepting rental request:', error.message);
    res.status(500).json({ error: error.message || 'Error accepting rental request' });
  }
}

/**
 * 대여 요청 수락 취소하는 컨트롤러
 * @param {import("express").Request} req - Express 요청 객체
 * @param {import("express").Response} res - Express 응답 객체
 * @return {Promise<void>}
 */
export async function cancelAcceptedRentalRequestController(req, res) {
  try {
    const { postId, requestId } = req.params;

    // 대여 요청 수락 취소
    await cancelAcceptedRentalRequest(postId, requestId);
    res.status(200).json({ message: '대여 요청 수락이 성공적으로 취소되었습니다.' });
  } catch (error) {
    console.error('Error cancelling accepted rental request:', error.message);
    res.status(500).json({ error: error.message || 'Error cancelling accepted rental request' });
  }
}

