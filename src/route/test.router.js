import express from 'express';
import passport from '@/config/passport'; 
import { requestRentalController, cancelRentalRequestController } from '@/feature/rent/rent.controller.js'; // 대여 요청 컨트롤러
import asyncHandler from 'express-async-handler';

const router = express.Router();

// 대여 요청 생성
router.post(
  '/posts/:postId/lent/request',  
  passport.authenticate('bearer', { session: false }),
  (req, res, next) => {
    console.log('User:', req.user); // 디버깅을 위한 로그 추가
    next();
  },
  asyncHandler(requestRentalController)
);

// 대여 요청 취소
router.delete(
  '/posts/:postId/lent/request',
  passport.authenticate('bearer', { session: false }),
  asyncHandler(cancelRentalRequestController)
);

export default router;
