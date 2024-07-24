import { response, ResponseCode } from "@/config/response";

/**
 * 404 not found handler
 * @type {import("express").RequestErrorHandler}
 */
const notFoundHandler = (req, res) => {
    res.status(404).send(response(ResponseCode.NOT_FOUND, null));
};

export default notFoundHandler;
