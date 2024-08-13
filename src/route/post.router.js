import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
    CreatePostController,
    DeletePostController,
    GetPostController,
    GetPostsController,
    UpdatePostController
} from "@/feature/post/post.controller.js";
import passport from "passport";
import loadRouters from "@/middleware/router";

export default async function initPostRouter() {
    const router = Router({ mergeParams: true });

    router.post(
        "/posts",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(CreatePostController)
    );

    router.get(
        "/posts",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(GetPostsController)
    );

    router.get(
        "/posts/:id",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(GetPostController)
    );

    router.patch(
        "/posts/:id",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(UpdatePostController)
    );

    router.delete(
        "/posts/:id",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(DeletePostController)
    );

    await loadRouters(router, __dirname, "post");


    return router;
}
