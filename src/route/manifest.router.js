import { Router } from "express";
import asyncHandler from "express-async-handler";
import { GetAreaManifestController } from "@/feature/manifest/area.controller";

export default async function initManifestRouter() {
    const router = Router({ mergeParams: true });

    router.get("/manifest/area", asyncHandler(GetAreaManifestController));

    return router;
}
