import "./env";
import logger from "./config/logger";
import { getDatabase, initDatabase } from "./config/db";
import { initExpress } from "./app";
import { getCache, initCache } from "@/config/cache";
import { initWebsocket } from "@/config/websocket";

(async () => {
    try {
        await initDatabase();
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
