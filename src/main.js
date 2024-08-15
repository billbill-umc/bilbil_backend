import "./env";
import logger from "./config/logger";
import { getDatabase, initDatabase, initQueryBuilder } from "./config/db";
import { createServer } from "http";
import { initWebSocket } from "./ws";
import { getCache, initCache } from "@/config/cache";
import { insertAreaToDatabase, isAreaDataExist } from "@/area-csv/insert-database";
import { parseArea, parseRawAreaCsv } from "@/area-csv/parse";
import { initExpress } from "@/app";
import { initS3Client } from "@/config/aws";

(async () => {
    try {
        // Initialize database and query builder
        await initDatabase();
        await initQueryBuilder();
        logger.info("Database initialized and query builder set up.");
    } catch (e) {
        logger.error("Failed to init database.");
        logger.error(e.message);
        logger.error(e.stack);
        process.exit(1);
    }

    try {
        // Initialize cache
        await initCache();
        logger.info("Cache initialized.");
    } catch (e) {
        logger.error("Failed to init cache.");
        logger.error(e.message);
        logger.error(e.stack);
        process.exit(1);
    }

    try {
        // Check and insert area data if needed
        logger.info("Checking if area data exists in database.");
        if (!await isAreaDataExist()) {
            logger.info("Area data does not exist in database. Inserting area data.");
            const rawAreaRecords = await parseRawAreaCsv();
            const areaData = parseArea(rawAreaRecords);
            await insertAreaToDatabase(areaData);
        } else {
            logger.info("Area data already exists in database. Skipping insertion.");
        }
    } catch (e) {
        logger.error("Failed to insert area data to database.");
        logger.error(e.message);
        logger.error(e.stack);
        process.exit(1);
    }

    try {
        // Initialize Express server
        const port = process.env.PORT || 3000;
        const app = await initExpress(); // Remove port if not used in initExpress

        // Start the server
        const server = app.listen(port, () => {
            logger.info(`Server listening on port ${port}.`);
        });

        // Initialize WebSocket server
        const wss = initWebsocket(server);
        logger.info("WebSocket initialized.");
    } catch (e) {
        logger.error("Failed to init web server.");
        logger.error(e.message);
        logger.error(e.stack);
        process.exit(1);
    }

    // Handle process exit
    process.on("exit", async () => {
        try {
            const dbConnection = getDatabase();
            await dbConnection.close();
        } catch (e) {
            logger.error("Error closing database connection.");
            logger.error(e.message);
            logger.error(e.stack);
        }

        try {
            const cacheConnection = await getCache();
            await cacheConnection.disconnect();
        } catch (e) {
            logger.error("Error disconnecting cache.");
            logger.error(e.message);
            logger.error(e.stack);
        }
    });
})();
