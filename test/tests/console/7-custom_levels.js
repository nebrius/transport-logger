var Logger = require('../../../'),
	logger = new Logger({
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