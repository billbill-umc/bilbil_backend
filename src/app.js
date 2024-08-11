import express from "express";
import passport from './config/passport'; 
import notFoundHandler from "./middleware/404-handler";
import unauthorizedHandler from "./middleware/401-handler";
import errorHandler from "./middleware/error-handler";
import responseLogger from "./middleware/response-logger";
import postRouter from './route/post.router.js'; 
import rentRouter from './route/rent.router.js';
import imageRouter from './route/image.router.js';
import path from 'path';

/**
 * Initialize express server
 * @return {import("express").Express}
 */
export async function initExpress() {
  const app = express();
  
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // 기본 미들웨어 설정
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powered-by");

  app.use(passport.initialize());

  if (process.env.NODE_ENV !== "test") {
    app.use(responseLogger); // 로거 미들웨어
  }

  // /api 경로에 모든 라우터 적용
  app.use("/api", postRouter);
  app.use("/api", rentRouter);
  app.use("/api", imageRouter)

  // 오류 처리 미들웨어 설정
  app.use(notFoundHandler);
  app.use(unauthorizedHandler);
  app.use(errorHandler);

  return app;
}
