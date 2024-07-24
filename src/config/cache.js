import { createClient } from "redis";
import logger from "@/config/logger";

/**
 * @type {import("redis").RedisClientType}
 */
let client;

export async function initCache() {
    const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

    if (!REDIS_HOST || !REDIS_PORT || !REDIS_USERNAME || !REDIS_PASSWORD) {
        throw new Error("Missing redis configuration.");
    }

    client = createClient({
        url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
        connectTimeout: 5000
    });

    client.on("ready", () => {
        logger.info("Cache connection established.");
    });

    client.on("end", () => {
        logger.info("Cache connection closed.");
    });

    await client.connect();
}

/**
 * @return {Promise<import("redis").RedisClientType>}
 */
export async function getCache() {
    if (!client.isReady) {
        await client.connect();
    }
    return client;
}
