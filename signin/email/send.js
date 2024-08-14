const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const db = require('../../src/db'); // 데이터베이스 연결
const router = express.Router();

// 이메일 전송기 객체 생성
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // 환경 변수에서 이메일 사용자
        pass: process.env.EMAIL_PASS  // 환경 변수에서 이메일 비밀번호
    }
});

// 인증 링크 전송 엔드포인트
router.post('/signin/email/send', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: '이메일이 필요합니다' });
    }

    // 인증 토큰 생성
    const token = crypto.randomBytes(32).toString('hex');

    // 데이터베이스에 토큰 저장
    db.query('INSERT INTO email_verifications (email, token) VALUES (?, ?)', [email, token], (err) => {
        if (err) {
            return res.status(500).json({ error: '데이터베이스 저장에 실패했습니다.' });
        }

        const verificationLink = `http://localhost:3000/signin/email/verify/${token}`;

        transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: '이메일 인증 링크',
            text: `다음 링크를 클릭하여 이메일 인증을 완료하십시오: ${verificationLink}`
        }, (err) => {
            if (err) {
                return res.status(500).json({ error: '이메일 전송에 실패했습니다.' });
            }
            res.status(200).json({ message: '인증 링크가 전송되었습니다' });
        });
    });
});

module.exports = router;

