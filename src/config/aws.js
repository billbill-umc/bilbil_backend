import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import logger from "@/config/logger";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } = process.env;

if (!AWS_ACCESS_KEY_ID || AWS_ACCESS_KEY_ID === "") {
    logger.error("AWS_ACCESS_KEY is not set.");
    process.exit(1);
}

if (!AWS_SECRET_ACCESS_KEY || AWS_SECRET_ACCESS_KEY === "") {
    logger.error("AWS_SECRET_ACCESS_KEY is not set.");
    process.exit(1);
}

if (!AWS_REGION || AWS_REGION === "") {
    logger.error("AWS_REGION is not set.");
    process.exit(1);
}

if (!AWS_S3_BUCKET || AWS_S3_BUCKET === "") {
    logger.error("AWS_S3_BUCKET is not set.");
    process.exit(1);
}

let client;

export async function initS3Client() {
    client = new S3Client({
        credentials: fromEnv()
    });

    await client.send(
        new PutObjectCommand({
            Bucket: AWS_S3_BUCKET,
            Key: "test.txt",
            Body: "Upload test file."
        })
    );
}

/**
 * @return {S3Client}
 */
export function getS3Client() {
    return client;
}

