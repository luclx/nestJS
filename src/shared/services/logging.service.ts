import { Injectable } from '@nestjs/common';
import * as log4js from 'log4js';
log4js.configure(
	{
		appenders: {
			out: { type: 'console' },
			error: {
				type: 'dateFile',
				filename: 'logs/error/error',
				pattern: "yyyy-MM-dd.txt",
				alwaysIncludePattern: true,
				backups: 20,
				maxLogSize: 1048576
			},
			exception: {
				type: 'dateFile',
				filename: 'logs/exception/exception',
				"pattern": "yyyy-MM-dd.txt",
				alwaysIncludePattern: true
			},
			default: {
				type: 'dateFile',
				filename: 'logs/default/default',
				"pattern": "yyyy-MM-dd.txt",
				alwaysIncludePattern: true
			}
		},
		categories: {
			error: { appenders: ['error'], level: 'error' },
			exception: { appenders: ['exception'], level: 'error' },
			default: { appenders: ['out', 'default'], level: 'info' },
		}
	}
);
const logger = log4js.getLogger('default');
const loggerError = log4js.getLogger('error');
const loggerException = log4js.getLogger('exception');

@Injectable()
export class LoggingService {
	static info(message) {
		logger.info(message);
	}
	static error(message) {
		loggerError.error(message);
	}
	static exception(message) {
		loggerException.error(message);
	}
}
