var Logger = require('../../../'),
	logger = new Logger({
		minLevel: 'trace'
	});

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');