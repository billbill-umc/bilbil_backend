import { Router } from "express";
import passport from "passport";
import { WithAuthController } from "@/feature/test/with-auth/with-auth.controller";
import asyncHandler from "express-async-handler";

export default async function initWithAuthRouter() {
    const router = Router({ mergeParams: true });

<<<<<<< HEAD
    router.get("/test/with-auth",
        // by add passport.authenticate("bearer")
        // this router will require bearer token (JWT in HTTP header "Authorization")
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(WithAuthController));
=======
    router.use(passport.initialize()); //passport 초기화
>>>>>>> feat1/게시물-작성-조회-업데이트-삭제-api-구현

    router.get("/test/with-auth",
      // by add passport.authenticate("bearer")
      // this router will require bearer token (JWT in HTTP header "Authorization")
      passport.authenticate("bearer", { session: false }),
      asyncHandler(WithAuthController));

  return router;
}
