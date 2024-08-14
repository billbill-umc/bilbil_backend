const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const router = express.Router();
const queries = require('../src/queries.js');  // DB 쿼리 함수 사용을 위해 필요
const errors = require('../src/error.js');  // 에러 처리 함수 사용을 위해 필요
const authCheck = require('./authCheck.js'); // 로그인 상태 확인 (정의된 상태여야 함)

// 미들웨어 설정
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.use(session({
  secret: '~~~',  // 원하는 문자 입력
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
}));

// 메인 페이지
router.get('/main', (req, res) => {
  if (!authCheck.isOwner(req, res)) {
    return errors.handleUnauthorizedError(res);
  }
  res.status(200).json({
    message: '메인 페이지에 오신 것을 환영합니다',
    user: req.session.nickname || '게스트'
  });
});

// 루트 경로
router.get('/', (req, res) => {
  if (!authCheck.isOwner(req, res)) {
    return errors.handleUnauthorizedError(res);
  } else {
    res.redirect('/main');
  }
});

// 로그인 프로세스
router.post('/login_process', (request, response) => {
  const { username, password } = request.body;

  if (username && password) {
    queries.getUserByUsernameAndPassword(username, password, (error, results) => {
      if (error) {
        return errors.handleInternalServerError(response, error);
      }
      if (results.length > 0) {
        request.session.is_logined = true;
        request.session.nickname = username;
        request.session.save(() => {
          response.status(200).json({ message: '로그인 성공' });
        });
      } else {
        errors.handleUnauthorizedError(response, '아이디 또는 비밀번호가 잘못되었습니다.');
      }
    });
  } else {
    errors.handleBadRequestError(response, '아이디와 비밀번호를 입력해주세요.');
  }
});

// 로그아웃
router.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return errors.handleInternalServerError(response, err);
    }
    response.status(200).json({ message: '로그아웃 성공' });
  });
});

// 회원가입 - 아이디 중복 확인
router.post('/check_username', (request, response) => {
  const { username } = request.body;

  if (username) {
    queries.checkUsername(username, (error, results) => {
      if (error) {
        return errors.handleInternalServerError(response, error);
      }
      if (results.length > 0) {
        errors.handleConflictError(response, '이미 존재하는 아이디입니다.');
      } else {
        response.status(200).json({ message: '사용 가능한 아이디입니다.' });
      }
    });
  } else {
    errors.handleBadRequestError(response, '아이디를 입력해주세요.');
  }
});

// 회원가입 프로세스
router.post('/signin', (request, response) => {
  const { username, password, phone } = request.body;

  if (username && password && phone) {
    queries.createUser(username, password, phone, (error) => {
      if (error) {
        return errors.handleInternalServerError(response, error);
      }
      response.status(200).json({ message: '회원가입이 완료되었습니다.' });
    });
  } else {
    errors.handleBadRequestError(response, '모든 필드를 입력해주세요.');
  }
});

module.exports = router;
