import { relative, resolve } from "path";
import { readdir } from "fs/promises";
import listEndpoints from "express-list-endpoints";
import logger from "@/config/logger";

/**
 * Load express routers
 * @param {express | express.Router} parent
 * @param {string} callerPath
 * @param {string} basePath
 * @return {Promise<void>}
 */
export default async function loadRouters(parent, callerPath, basePath) {
    const routerPath = resolve(callerPath, basePath);
    const baseImportPath = relative(__dirname, routerPath);
    const importPath = !baseImportPath.startsWith(".") ? `./${baseImportPath}` : baseImportPath;

    let routerFiles;
    try {
        routerFiles = (await readdir(routerPath))
            .filter(f => f.endsWith(".router.js"))
            .map(f => f.replace(".js", ""));
    } catch (e) {
        logger.error("Failed to load router files.", e);
        process.exit(1);
    }

    for (const routerFile of routerFiles) {
        const importFullUrl = `${importPath}/${routerFile}`;
        const routerInitFunction = (await import(importFullUrl))?.default;

        try {
            const router = await routerInitFunction();
            parent.use(router);
            const endpoints = listEndpoints(router);
            const endpointLogging = endpoints.map(e => `${e.methods.join("|")} ${e.path}`).join("\n\t\t\t\t");
            logger.info(`Router imported from ${importFullUrl} with endpoints:\n\t\t\t\t${endpointLogging}`);
        } catch (e) {
            logger.error(`Failed to load router from ${importFullUrl}.js. Skip importing.`, e);
        }
    }
}
