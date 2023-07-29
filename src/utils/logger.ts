import winstonDaily from 'winston-daily-rotate-file';
import winston from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { LOG_DIR } from '@config';

const logDir: string = join(__dirname, LOG_DIR ?? '../logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logFormat = winston.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`);

const createDailyRotateFileTransport = (level: string, dirname: string) =>
  new winstonDaily({
    level: level,
    datePattern: 'YYYY-MM-DD',
    dirname: `${logDir}/${dirname}`,
    filename: `%DATE%.log`,
    maxFiles: 30,
    json: false,
    zippedArchive: true,
    ...(level === 'error' && { handleExceptions: true }),
  });

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    createDailyRotateFileTransport('debug', 'debug'),
    createDailyRotateFileTransport('error', 'error'),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(winston.format.splat(), winston.format.colorize()),
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
