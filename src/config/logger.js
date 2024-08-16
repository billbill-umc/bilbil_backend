import { addColors, createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";

const ERROR_LOG = process.env.ERROR_LOG;
const INFO_LOG = process.env.INFO_LOG;
const MAX_LOG_SIZE = process.env.MAX_LOG_SIZE ?? "20m";
const MAX_LOG_FILES = process.env.MAX_LOG_FILES ?? "14d";

const consoleLogger = new transports.Console({
    format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(ctx => {
            return `[${ctx.timestamp}] [${ctx.level}] ${ctx.message}${ctx.stack ? `\n${ctx.stack}` : ""}`;
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
    loggerTransports.push(errorFileLogger);
}

if (typeof INFO_LOG === "string" && INFO_LOG !== "") {
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
    loggerTransports.push(infoFileLogger);
}

const logger = createLogger({
    level: "info",
    transports: loggerTransports
});

export default logger;
