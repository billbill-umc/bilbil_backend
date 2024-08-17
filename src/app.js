import express from "express";
import "./config/passport";
import passport from './config/passport'; 
import notFoundHandler from "./middleware/404-handler";
import unauthorizedHandler from "./middleware/401-handler";
import errorHandler from "./middleware/error-handler";
import responseLogger from "./middleware/response-logger";
import loadRouters from "./middleware/router";


/**
 * Initialize express server
 * @return import("express").Express
 */
export async function initExpress() {
    const app = express();

    app.disable("x-powered-by");

  // 기본 미들웨어 설정
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.disable("x-powered-by");

  app.use(passport.initialize());

  if (process.env.NODE_ENV !== "test") {
    app.use(responseLogger); // 로거 미들웨어
  }
    // default middlewares before routers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    if (process.env.NODE_ENV !== "test") app.use(responseLogger);

  // /api 경로에 모든 라우터 적용
  app.use("/api", postRouter);
  app.use("/api", rentRouter);
  app.use("/api", imageRouter)
    // apply feature handlers
    await loadRouters(app, __dirname, "route");

  // 오류 처리 미들웨어 설정
  app.use(notFoundHandler);
  app.use(unauthorizedHandler);
  app.use(errorHandler);
    // default middlewares after routers
    app.use(unauthorizedHandler);
    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
}
