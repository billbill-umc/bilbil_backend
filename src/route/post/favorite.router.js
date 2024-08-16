import { Router } from "express";
import passport from "passport";
import asyncHandler from "express-async-handler";
import { DoFavoriteController } from "@/feature/post/favorite/favorite.controller";

export default async function initFavoriteRouter() {
    const router = Router({ mergeParams: true });

    router.post(
        "/posts/:postId/favorite",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(DoFavoriteController)
    );

    return router;
}
