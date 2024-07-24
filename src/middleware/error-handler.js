import logger from "@/config/logger";
import { response, ResponseCode } from "@/config/response";

/**
 * global error handler.
 * @type {import("express").ErrorRequestHandler}
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
    logger.error(err);
    res.status(500).send(response(ResponseCode.UNKNOWN_ERROR, null));
};

export default errorHandler;
