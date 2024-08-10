const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session);
const router = express.Router();  // 라우터를 정의하므로 이 부분은 유지
const queries = require('../src/queries.js');  // DB 쿼리 함수 사용을 위해 필요
const errors = require('../src/error.js');  // 에러 처리 함수 사용을 위해 필요

// authCheck 모듈을 삭제하려면 내부 함수를 auth.js에서 직접 정의해야 하지만, 
// authCheck의 함수가 그대로 사용된다면 authCheck는 유지해야 함

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
    message: 'Welcome to the main page',
    user: req.session.nickname || 'Guest'
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
          response.status(200).json({ message: 'Login successful' });
        });
      } else {
        errors.handleUnauthorizedError(response, 'Invalid username or password');
      }
    });
  } else {
    errors.handleBadRequestError(response, 'Please provide username and password');
  }
});

// 로그아웃
router.get('/logout', (request, response) => {
  request.session.destroy((err) => {
    if (err) {
      return errors.handleInternalServerError(response, err);
    }
    response.status(200).json({ message: 'Logout successful' });
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
        errors.handleConflictError(response, 'Username already exists');
      } else {
        response.status(200).json({ message: 'Username is available' });
      }
    });
  } else {
    errors.handleBadRequestError(response, 'Please provide a username');
  }
});

// 회원가입 프로세스
router.post('/register_process', (request, response) => {
  const { username, password, phone } = request.body;

  if (username && password && phone) {
    queries.createUser(username, password, phone, (error) => {
      if (error) {
        return errors.handleInternalServerError(response, error);
      }
      response.status(200).json({ message: 'Registration successful' });
    });
  } else {
    errors.handleBadRequestError(response, 'Please fill out all fields');
  }
});

module.exports = router;

// 이메일 인증 링크 요청 후 회원가입 페이지로 이동
async function handleSignupRequest() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    
    // 이메일 인증 링크 요청
    await requestVerificationLink(email);

    // 사용자에게 이메일 인증 링크 클릭 후 회원가입 페이지로 이동하라고 안내
    alert('인증 링크가 이메일로 전송되었습니다. 링크를 클릭하여 회원가입을 완료해 주세요.');
}
