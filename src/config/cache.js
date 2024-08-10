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

    if (!REDIS_HOST || !REDIS_PORT) {
        throw new Error("Missing redis configuration.");
    }

    let url = "redis://";

    if (typeof REDIS_USERNAME === "string" && REDIS_USERNAME !== "") {
        url += REDIS_USERNAME;
    } else {
        url += "default";
    }

    if (typeof REDIS_PASSWORD === "string" && REDIS_PASSWORD !== "") {
        url += `:${REDIS_PASSWORD}`;
    }

    url += `@${REDIS_HOST}:${REDIS_PORT}/0`;

    originClient = createClient({
        url, connectTimeout: 5000
    });
}

/**
 * @return {Promise<import("redis").RedisClientType>}
 */
export async function getCache() {
    if (!client || !client.isReady) {
        client = originClient.duplicate();

        client.on("connect", () => {
            logger.info("Cache connection established.");
        });

        client.on("end", () => {
            logger.info("Cache connection closed.");
        });

        await client.connect();
    }
    return client;
}

/**
 * @return {import("redis").RedisClientType}
 */
export function getDuplicated() {
    const duplicated = originClient.duplicate();

    duplicated.on("ready", () => {
        logger.info("Cache connection established.");
    });

    duplicated.on("end", () => {
        logger.info("Cache connection closed.");
    });

    return duplicated;
}

