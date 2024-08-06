import "./env";
import logger from "./config/logger";
import { getDatabase, initDatabase, initQueryBuilder } from "./config/db";
import { initExpress } from "./app";
import { getCache, initCache } from "@/config/cache";
import { initWebsocket } from "@/config/websocket";
import { insertAreaToDatabase, isAreaDataExist } from "@/area-csv/insert-database";
import { parseArea, parseRawAreaCsv } from "@/area-csv/parse";

(async () => {
    try {
        await initDatabase();
        await initQueryBuilder();
    } catch (e) {
        logger.error("Failed to init database.");
        logger.error(e);
        process.exit(1);
    }

    try {
        await initCache();
    } catch (e) {
        logger.error("Failed to init cache.");
        logger.error(e);
        process.exit(1);
    }

    try {
        logger.info("Checking if area data exists in database.");
        if (!await isAreaDataExist()) {
            logger.info("Area data does not exist in database. Inserting area data to database.");
            const rawAreaRecords = await parseRawAreaCsv();
            const areaData = parseArea(rawAreaRecords);
            await insertAreaToDatabase(areaData);
        } else {
            logger.info("Area data already exists in database. Skip inserting area data to database.");
        }
    } catch (e) {
        logger.error("Failed to insert area data to database.");
        logger.error(e);
        process.exit(1);
    }

    try {
        const port = process.env.PORT || 3000;
        const app = await initExpress(port);


        const server = app.listen(port, () => {
            logger.info(`Server listening on port ${port}.`);
        });

   
        const wss = initWebsocket(server);

 
    
    } catch (e) {
        logger.error(e.message);
        process.exit(1);
    }

    process.on("exit", () => {
        const dbConnection = getDatabase();
        dbConnection.close().catch(e => logger.error(e.message));

        getCache().then(connection => connection.disconnect())
            .catch(e => logger.error(e.message));
    });
})();
