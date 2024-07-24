import { Router } from "express";
import asyncHandler from "express-async-handler";
import loadRouters from "@/middleware/router";
import { GetTestController } from "@/feature/test/test.controller";

export default async function initTestRouter() {
    const router = Router({ mergeParams: true });

    await loadRouters(router, __dirname, "with-auth");

    router.get("/test", asyncHandler(GetTestController));

    return router;
}
