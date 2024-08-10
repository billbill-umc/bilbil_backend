const express = require('express');
const authRouter = require('./signin/signin');  // auth.js로 변경
const bodyParser = require('body-parser');
const emailVerificationRoutes = require('./emailVerification');

const app = express();
const port = 3000;

// 라우팅 설정
app.use('/api', sendVerificationRouter);
app.use('/api', verifyEmailRouter);
app.use('/api', registerRouter);

// 인증 라우터 사용
app.use('/', authRouter);

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// 이메일 인증 라우터 사용
app.use('/api', emailVerificationRoutes);

// 기존 로그인 및 회원가입 라우터 추가
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다`);
});

// 페이지가 로드될 때 이메일 URL 파라미터에서 가져오기
window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get('email');

  if (email) {
      document.getElementById('emailInput').value = email;
  }
};

// 회원가입 폼 제출 함수
async function submitSignupForm() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
  });
  const result = await response.json();
  console.log(result);
}

// 회원가입 버튼 클릭 이벤트 핸들러
document.getElementById('signupButton').addEventListener('click', async () => {
  await submitSignupForm();
});