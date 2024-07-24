import { response, ResponseCode } from "@/config/response";

/**
 * 401 handler
 * @type {import("express").ErrorRequestHandler}
 */
const unauthorizedHandler = (err, req, res, next) => {
    if (err?.status === 401) {
        res.status(401).send(response(ResponseCode.UNAUTHORIZED, null));
    } else {
        next(err);
    }
};

export default unauthorizedHandler;
