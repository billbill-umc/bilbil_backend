import { createPool } from "mysql2/promise";
import logger from "@/config/logger";

/**
 * @type {import("mysql2/promise").Pool}
 */
let pool;

export function initDatabase() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = process.env;
    if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASSWORD || !DB_DATABASE) {
        throw new Error("Missing database configuration.");
    }

    pool = createPool({
        host: DB_HOST,
        port: isNaN(Number(DB_PORT)) ? 3306 : Number(DB_PORT),
        user: DB_USER,
        password: DB_PASSWORD
    });

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
