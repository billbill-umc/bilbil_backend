import { Router } from "express";
import passport from "passport";
import asyncHandler from "express-async-handler";
import {
    AcceptRequestController,
    CancelAcceptController,
    CancelRequestController,
    RequestRentController
} from "@/feature/post/rent/rent.controller";

export default async function initRentRouter() {
    const router = Router({ mergeParams: true });

    router.post(
        "/posts/:postId/rent/request",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(RequestRentController)
    );

    router.delete(
        "/posts/:postId/rent/request",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(CancelRequestController)
    );

    router.post(
        "/posts/:postId/rent/accept",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(AcceptRequestController)
    );

    router.delete(
        "/posts/:postId/rent/accept",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(CancelAcceptController)
    );

    return router;
}
