import { Router } from "express";
import asyncHandler from "express-async-handler";
import {
    CreateSignInMailController,
    SignInController,
    VerifyEmailController
} from "@/feature/signin/signin.controller";


export default async function initSignInRouter() {
    const router = Router({ mergeParams: true });


    router.post("/signin/email/send", asyncHandler(CreateSignInMailController));

    router.post("/signin/email/verify", asyncHandler(VerifyEmailController));

    router.post("/signin", asyncHandler(SignInController));

    return router;
}
