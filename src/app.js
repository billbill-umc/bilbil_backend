import express from "express";
import './config/passport'; 
import notFoundHandler from "./middleware/404-handler";
import unauthorizedHandler from "./middleware/401-handler";
import errorHandler from "./middleware/error-handler";
import responseLogger from "./middleware/response-logger";
import postRouter from './route/post.router.js'; 

/**
 * Initialize express server
 * @return {import("express").Express}
 */
export async function initExpress() {
  const app = express();

  app.disable("x-powered-by");

  // 기본 미들웨어 설정
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  if (process.env.NODE_ENV !== "test") app.use(responseLogger);

  // /api 경로에 모든 라우터 적용
  app.use("/api", postRouter);

  // 기본 미들웨어 설정
  app.use(notFoundHandler);
  app.use(unauthorizedHandler);
  app.use(errorHandler);

  return app;
}
