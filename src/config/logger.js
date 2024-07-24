import { addColors, createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const ERROR_LOG = process.env.ERROR_LOG ?? "logs/%DATA%.error";
const INFO_LOG = process.env.INFO_LOG ?? "logs/%DATA%.log";
const MAX_LOG_SIZE = process.env.MAX_LOG_SIZE ?? "20m";
const MAX_LOG_FILES = process.env.MAX_LOG_FILES ?? "14d";

const errorFileLogger = new transports.DailyRotateFile({
    level: "error",
    filename: ERROR_LOG,
    datePattern: "YYYY-MM-DD_HH",
    zippedArchive: true,
    maxSize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    format: format.combine(
        format.errors({ stack: true }),
        format.json(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
    )
});

const infoFileLogger = new transports.DailyRotateFile({
    filename: INFO_LOG,
    datePattern: "YYYY-MM-DD_HH",
    zippedArchive: true,
    maxSize: MAX_LOG_SIZE,
    maxFiles: MAX_LOG_FILES,
    format: format.combine(
        format.errors({ stack: true }),
        format.json(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
    )
});

const consoleLogger = new transports.Console({
    format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.timestamp(),
        format.printf(({ level, message, timestamp, stack }) => `[${timestamp}][${level}] ${message}${stack ? `\n${stack}` : ""}`)
    )
});

addColors({
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "grey",
    info: "green"
});

const logger = createLogger({
    level: "info",
    transports: [
        errorFileLogger, infoFileLogger, consoleLogger
    ]
});

export default logger;
