import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
    GetChattingByIdController,
    GetChattingsController,
    PostChattingController
} from "@/feature/chat/chattings.controller";
import passport from "passport";
import loadRouters from "@/middleware/router";

export default async function initChattingsRouter() {
    const router = Router({ mergeParams: true });

    await loadRouters(router, __dirname, "chatting");

    router.get(
        "/chattings",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(GetChattingsController)
    );

    router.post(
        "/chattings",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(PostChattingController)
    );

    router.get(
        "/chattings/:chattingId",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(GetChattingByIdController)
    );

    return router;
}
