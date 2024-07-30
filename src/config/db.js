import { createPool } from "mysql2/promise";
import logger from "@/config/logger";
import { knex } from "knex";

/**
 * @type {import("mysql2/promise").Pool}
 */
let pool;

function createConnectionOption() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
        throw new Error("Missing database configuration.");
    }

    return {
        host: DB_HOST,
        port: isNaN(Number(DB_PORT)) ? 3306 : Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE
    };
}

export function initDatabase() {
    pool = createPool(createConnectionOption());

    pool.on("connection", () => {
        logger.info("Database connection established.");
    });

    pool.on("release", () => {
        logger.info("Database connection closed.");
    });
}

/**
 * Get database connection pool
 * @return {import("mysql2/promise").Pool}
 */
export function getDatabase() {
    return pool;
}

/**
 * @typedef {knex&(<TRecord=any extends {}, TResult=unknown[]>(config: (Knex.Config | string)) => Knex<TRecord, TResult>)} KnexBuilderFunction
 */

/**
 * @type {import("knex").Knex}
 */
let builder;

export function initQueryBuilder() {
    builder = knex({
        client: "mysql2",
        connection: createConnectionOption(),
        log: {
            warn(message) { logger.warn(message); },
            error(message) { logger.error(message); },
            debug(message) { logger.debug(message); }
        }
    });
}

/**
 * @return {import("knex").knex}
 */
export function getQueryBuilder() {
    return builder;
}
