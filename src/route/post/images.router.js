import { Router } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { getS3Client } from "@/config/aws";
import passport from "passport";
import asyncHandler from "express-async-handler";
import {
    AfterCreatePostImageController,
    BeforeCreatePostImageController,
    DeletePostImageController
} from "@/feature/post/images/images.controller";
import { mimeToExt } from "@/util/mime";
import imageUploadErrorHandler from "@/middleware/image-upload-error-handler";
import { InvalidMimeTypeError } from "@/model/error";

export default async function initImagesRouter() {
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
        "/posts/:postId/images",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(BeforeCreatePostImageController),
        upload.single("image"),
        asyncHandler(AfterCreatePostImageController),
        imageUploadErrorHandler
    );

    router.delete(
        "/posts/:postId/images/:imageId",
        passport.authenticate("bearer", { session: false, failWithError: true }),
        asyncHandler(DeletePostImageController)
    );

    return router;
}
