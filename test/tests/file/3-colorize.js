var os = require('os'),
	path = require('path'),
	Logger = require('../../../'),
	file = path.join((os.tmpdir || os.tmpDir)(), 'transport-logger-file-1-' + Date.now() + '.log'),
	logger = new Logger({
		file: file,
		minLevel: 'trace',
		colorize: true
	});

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');

console.log(file);