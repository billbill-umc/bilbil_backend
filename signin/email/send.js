const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const router = express.Router();

// 인증 링크 토큰 저장소 (메모리 기반)
const verificationTokens = {};

// 이메일 전송기 객체 생성
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // 환경 변수에서 이메일 사용자
        pass: process.env.EMAIL_PASS  // 환경 변수에서 이메일 비밀번호
    }
});

// 인증 링크 전송 엔드포인트
router.post('/send-verification-link', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: '이메일이 필요합니다' });
    }

    // 인증 토큰 생성
    const token = crypto.randomBytes(32).toString('hex');
    verificationTokens[token] = email;

    // 인증 링크 생성
    const verificationLink = `http://localhost:3000/api/verify-email/${token}`;

    // 이메일 전송
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '이메일 인증 링크',
            text: `다음 링크를 클릭하여 이메일 인증을 완료하십시오: ${verificationLink}`
        });
        res.status(200).json({ message: '인증 링크가 전송되었습니다' });
    } catch (error) {
        res.status(500).json({ error: '이메일 전송에 실패했습니다' });
    }
});

module.exports = { router, verificationTokens };


