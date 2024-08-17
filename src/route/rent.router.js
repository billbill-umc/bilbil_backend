import express from 'express';
import passport from '@/config/passport'; 
import { requestRentalController, cancelRentalRequestController, acceptRentalRequestController, cancelAcceptedRentalRequestController } from '@/feature/rent/rent.controller.js'; // 대여 요청 컨트롤러
import asyncHandler from 'express-async-handler';
import { cancelAcceptedRentalRequest } from '@/feature/rent/rent.service';

const router = express.Router();

//대여 요청 엔드포인트
router.post(
  '/posts/:postId/lent/request',  
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    console.log('User:', req.user); // 디버깅을 위한 로그 추가
    next();
  },
  asyncHandler(requestRentalController)
);

//대여 요청 취소 엔드포인트
router.delete(
  '/posts/:postId/lent/request/:requestId', //라우트 변경사항 있습니다.
  passport.authenticate('bearer', { session: false }),
  asyncHandler(cancelRentalRequestController)
);

//대여 요청 수락 엔드포인트
router.post(
  '/posts/:postId/lent/accept/:requestId',
  passport.authenticate('bearer', { session: false }),
  asyncHandler(acceptRentalRequestController)
);

//대여 요청 수락 취소 엔드포인트 
router.delete(
  '/posts/:postId/lent/accept/:requestId',
  passport.authenticate('bearer', { session: false }),
  asyncHandler(cancelAcceptedRentalRequestController)
);

export default router;