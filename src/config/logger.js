import { addColors, createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const ERROR_LOG = process.env.ERROR_LOG;
const INFO_LOG = process.env.INFO_LOG;
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
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json()
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
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.json()
    )
});

const consoleLogger = new transports.Console({
    format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(ctx => {
            if (ctx.message instanceof Error) {
                ctx.stack = ctx.message.stack;
                ctx.message = ctx.message.message;
            }
            const { level, message, timestamp, stack } = ctx;
            return `[${timestamp}][${level}] ${message ?? ""}${stack ? `\n${stack}` : ""}`;
        })
    )
});

addColors({
    error: "red",
    debug: "blue",
    warn: "yellow",
    data: "grey",
    info: "green"
});

const loggerTransports = [ consoleLogger ];

if (typeof ERROR_LOG === "string" && ERROR_LOG !== "") {
    loggerTransports.push(errorFileLogger);
}

if (typeof INFO_LOG === "string" && INFO_LOG !== "") {
    loggerTransports.push(infoFileLogger);
}

const logger = createLogger({
    level: "info",
    transports: loggerTransports
});

export default logger;
