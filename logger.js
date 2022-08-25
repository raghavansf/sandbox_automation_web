import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

let date = new Date().toUTCString();
const consoleLogFormat = format.printf(function(info) {
  let bodyMsg = info.meta ? info.meta : info.message;
  return `${date} - ${info.level}: ${JSON.stringify(bodyMsg, null, 4)}\n`;
});

//using DailyRotateFile - it creates a log file for the day, once the maxSize has been reached it will create another one
//maxFiles is used to delete the log files 14 days after created date. It can be changed to # of files as well.
//it creates audit files so it keep track on what file needs to be removed.

let prodTransports = [];
let localConsoleTransport = [];


if(process.env.NODE_ENV === 'production') {
  prodTransports = [
    new transports.DailyRotateFile({
      filename: 'web-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
      maxFiles: '14d'
    }),
    new transports.DailyRotateFile({
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '1m',
      maxFiles: '14d'
    })
  ]
} else {
  localConsoleTransport = new transports.Console({
    format: format.combine(
      format.colorize(),
      consoleLogFormat
    ),
    level: 'info'
  })
}

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: process.env.NODE_ENV === 'production' ? prodTransports : localConsoleTransport
});

export default logger;


