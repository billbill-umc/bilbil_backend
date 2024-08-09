import { Router } from "express";
import asyncHandler from "express-async-handler";
import passport from "passport";
import {
    DeleteNotificationController,
    GetNotificationController,
    SetNotificationReadController
} from "@/feature/notification/notification.controller";

export default async function initNotificationsRouter() {
    const router = Router({ mergeParams: true });

    router.get(
        "/notifications",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(GetNotificationController)
    );

    router.post(
        "/notifications/:notificationId",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(SetNotificationReadController)
    );

    router.delete(
        "/notifications/:notificationId",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(DeleteNotificationController)
    );

    return router;
}
