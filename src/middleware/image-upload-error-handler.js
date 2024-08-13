import { InvalidMimeTypeError } from "@/model/error";
import { response, ResponseCode } from "@/config/response";

/**
 * global error handler.
 * @type {import("express").ErrorRequestHandler}
 */
const errorHandler = (err, req, res, next) => {
    if (err instanceof InvalidMimeTypeError) {
        return res.send(response(ResponseCode.INVALID_MIME_TYPE, null));
    }

    throw err;
};

export default errorHandler;
