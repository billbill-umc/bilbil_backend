import { createClient } from "redis";
import logger from "@/config/logger";

/**
 * @type {import("redis").RedisClientType}
 */
let originClient;

/**
 * @type {import("redis").RedisClientType}
 */
let client;


export async function initCache() {
    const { REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD } = process.env;

    if (!REDIS_HOST || !REDIS_PORT || !REDIS_USERNAME || !REDIS_PASSWORD) {
        throw new Error("Missing redis configuration.");
    }

    originClient = createClient({
        url: `redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0`,
        connectTimeout: 5000
    });

    originClient.on("ready", () => {
        logger.info("Cache connection established.");
    });

    originClient.on("end", () => {
        logger.info("Cache connection closed.");
    });
}

/**
 * @return {Promise<import("redis").RedisClientType>}
 */
export async function getCache() {
    if (!client || !client.isReady) {
        client = originClient.duplicate();
        await client.connect();
    }
    return client;
}

/**
 * @return {import("redis").RedisClientType}
 */
export function getDuplicated() {
    return originClient.duplicate();
}

