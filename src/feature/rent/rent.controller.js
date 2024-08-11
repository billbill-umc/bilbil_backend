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
        const borrowerId = req.user.id; // 인증된 사용자의 ID 추출
        const { dateBegin, dateEnd } = req.body; // 요청 본문에서 데이터 추출

        // 대여 요청 생성
        const rentalRequest = await createRentalRequest(postId, borrowerId, dateBegin, dateEnd);
        res.status(201).json(rentalRequest); // 성공적으로 생성된 요청 반환
    } catch (error) {
        console.error('Error creating rental request:', error);
        res.status(500).json({ error: 'Error creating rental request' }); // 서버 오류 응답
    }
}
