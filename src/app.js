import express from "express";
import "./config/passport";
import notFoundHandler from "./middleware/404-handler";
import unauthorizedHandler from "./middleware/401-handler";
import errorHandler from "./middleware/error-handler";
import responseLogger from "./middleware/response-logger";
import loadRouters from "./middleware/router";


/**
 * Initialize express server
 * @return import("express").Express
 */
export async function initExpress() {
    const app = express();

    app.disable("x-powered-by");

    // default middlewares before routers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    if (process.env.NODE_ENV !== "test") app.use(responseLogger);

    // apply feature handlers
    await loadRouters(app, __dirname, "route");

    // default middlewares after routers
    app.use(notFoundHandler);
    app.use(unauthorizedHandler);
    app.use(errorHandler);

    return app;
}
