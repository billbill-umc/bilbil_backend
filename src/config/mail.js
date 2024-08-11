import { createTransport } from "nodemailer";
import logger from "@/config/logger";

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD } = process.env;


if (!MAIL_HOST || MAIL_HOST === "") {
    logger.error("MAIL_HOST is not defined");
    process.exit(1);
}

if (!MAIL_PORT || MAIL_PORT === "" || isNaN(Number(MAIL_PORT))) {
    logger.error("MAIL_PORT is not defined");
    process.exit(1);
}

if (!MAIL_USER || MAIL_USER === "") {
    logger.error("MAIL_USER is not defined");
    process.exit(1);
}

if (!MAIL_PASSWORD || MAIL_PASSWORD === "") {
    logger.error("MAIL_PASSWORD is not defined");
    process.exit(1);
}

const transport = createTransport({
    pool: true,
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD
    }
});

/**
 * @param {string} from
 * @param {string} to
 * @param {string} subject
 * @param {string} html
 * @return {Promise<*>}
 */
export async function sendMail(from, to, subject, html) {
    return transport.sendMail({
        from, to, subject, html
    });
}
