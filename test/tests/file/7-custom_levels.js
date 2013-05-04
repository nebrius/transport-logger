var os = require('os'),
	path = require('path'),
	Logger = require('../../../'),
	file = path.join((os.tmpdir || os.tmpDir)(), 'transport-logger-file-1-' + Date.now() + '.log'),
	logger = new Logger({
		file: file,
		minLevel: 'b',
		colorize: true
	}, {
		levels: [{
				id: 'a',
				color: 'red'
			}, {
				id: 'b',
				color: 'green'
			}, {
				id: 'c',
				color: 'blue'
			}, {
				id: 'd',
				color: 'cyan'
			}, {
				id: 'e',
				color: 'magenta'
			}]
	});

logger.a('a');
logger.b('b');
logger.c('c');
logger.d('d');
logger.e('e');

console.log(file);