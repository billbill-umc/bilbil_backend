import { Router } from "express";
import passport from "passport";
import { WithAuthController } from "@/feature/test/with-auth/with-auth.controller";
import asyncHandler from "express-async-handler";

export default async function initWithAuthRouter() {
    const router = Router({ mergeParams: true });

    router.use(passport.initialize()); //passport 초기화

    router.get("/test/with-auth",
      // by add passport.authenticate("bearer")
      // this router will require bearer token (JWT in HTTP header "Authorization")
      passport.authenticate("bearer", { session: false }),
      asyncHandler(WithAuthController));

  return router;
}
