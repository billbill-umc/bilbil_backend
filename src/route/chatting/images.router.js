import { Router } from "express";
import passport from "passport";
import asyncHandler from "express-async-handler";
import {
    AfterCreateChattingImageController,
    BeforeCreateChattingImageController
} from "@/feature/chat/images/images.controller";
import imageUploadErrorHandler from "@/middleware/image-upload-error-handler";
import multer from "multer";
import multerS3 from "multer-s3";
import { getS3Client } from "@/config/aws";
import { mimeToExt } from "@/util/mime";
import { InvalidMimeTypeError } from "@/model/error";

export default async function initChattingsRouter() {
    const router = Router({ mergeParams: true });

    const upload = multer({
        storage: multerS3({
            s3: getS3Client(),
            bucket: process.env.AWS_S3_BUCKET,
            key: (req, file, cb) => {
                const ext = mimeToExt(file.mimetype);

                if (!ext) {
                    return cb(new InvalidMimeTypeError);
                }
                if (!(ext === "jpeg" || ext === "jpg" || ext === "png")) {
                    return cb(new InvalidMimeTypeError);
                }

                cb(null, `${req.imageName}.${ext}`);
            }
        })
    });

    router.post(
        "/chattings/:chattingId/images",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(BeforeCreateChattingImageController),
        upload.single("image"),
        asyncHandler(AfterCreateChattingImageController),
        imageUploadErrorHandler
    );

    return router;
}
