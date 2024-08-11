import express from 'express';
import passport from '@/config/passport'; 
import { requestRentalController } from '@/feature/rent/rent.controller.js'; // 대여 요청 컨트롤러
import asyncHandler from 'express-async-handler';

const router = express.Router();

// 대여 요청 엔드포인트
router.post(
  '/posts/:id/lent/request',
  passport.authenticate('bearer', { session: false }), // JWT 인증 미들웨어 적용
  asyncHandler(requestRentalController) // 대여 요청 처리 컨트롤러
);

export default router;
