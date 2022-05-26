import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";
const { combine, timestamp, printf, colorize, simple } = winston.format;

const logDir = "./src/config/logs";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};
winston.addColors(colors);

const level = () => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};


const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    printf((info) => {
        return `[ ${info.timestamp} ] || [ ${info.level} ]: ${info.message}`
    })
)

const consoleOpts = {
    handleExceptions: true,
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' })
    )
  }

const transports = [
    new winston.transports.Console(consoleOpts),
    new winstonDaily({
        level: "debug",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + `/debug`,
        filename: `%DATE%.log`,
        maxFiles: 10,
        zippedArchive: true,
    }),
    new winstonDaily({
        level: "error",
        datePattern: "YYYY-MM-DD",
        dirname: logDir + `/error`,
        filename: `%DATE%.error.log`,
        maxFiles: 10,
        zippedArchive: true,
    }),
];

const logger = winston.createLogger({
    level: level(),
    levels,
    format: logFormat,
    transports,
});

export default logger;