import { Router } from "express";
import asyncHandler from "express-async-handler";
import { GetTokenController, RefreshTokenController } from "@/feature/auth/auth.controller";

export default async function initAuthRouter() {
    const router = Router({ mergeParams: true });

    router.get("/auth/token", asyncHandler(GetTokenController));
    router.get("/auth/token/refresh", asyncHandler(RefreshTokenController));

    return router;
}
