import { createLogger, format, transports } from 'winston';

const { combine, printf, colorize } = format;

const customFormat = printf(({ level, message }) => {
  return `[${level}]: ${message}`;
});

const logger = createLogger({
  format: combine(colorize(), customFormat),
  transports: [
    new transports.Console(),
  ],
});

export default logger;