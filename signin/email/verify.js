const express = require('express');
const router = express.Router();
const { verificationTokens } = require('./sendVerification.js'); // 토큰 저장소 가져오기

// 인증 링크 클릭 시 이메일 확인 엔드포인트
router.get('/verify-email/:token', (req, res) => {
    const { token } = req.params;

    if (!token || !verificationTokens[token]) {
        return res.status(400).json({ error: '잘못된 토큰입니다' });
    }

    const email = verificationTokens[token];
    delete verificationTokens[token];

    // 안드로이드에서 이 응답을 받아 회원가입 화면으로 이동하게 할 수 있음
    res.status(200).json({ message: '이메일 인증이 완료되었습니다.', email });
});

module.exports = router;
