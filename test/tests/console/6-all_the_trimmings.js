var Logger = require('../../../'),
	logger = new Logger({
		minLevel: 'trace',
		timestamp: true,
		prependLevel: true,
		colorize: true
	});

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');