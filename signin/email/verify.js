const express = require('express');
const db = require('../../src/db'); // 데이터베이스 연결
const router = express.Router();

// 인증 링크 클릭 시 이메일 확인 엔드포인트
router.get('/signin/email/verify/:token', (req, res) => {
    const { token } = req.params;

    // 데이터베이스에서 토큰 확인
    db.query('SELECT email FROM email_verifications WHERE token = ?', [token], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ error: '잘못된 토큰입니다.' });
        }

        const email = results[0].email;

        // 인증이 완료되면, 데이터베이스에서 해당 레코드 삭제
        db.query('DELETE FROM email_verifications WHERE token = ?', [token], (err) => {
            if (err) {
                return res.status(500).json({ error: '인증 후 데이터 삭제에 실패했습니다.' });
            }

            res.status(200).json({ message: '이메일 인증이 완료되었습니다.', email });
        });
    });
});

module.exports = router;
