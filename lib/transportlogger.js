/*
The MIT License (MIT)

Copyright (c) 2013 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/**
 * @module transport-logger
 */

var stream = require('stream'),
	fs = require('fs'),
	path = require('path'),

	colorMap = {
		black: '\x1b[30m',
		red: '\x1b[31m',
		green: '\x1b[32m',
		yellow: '\x1b[33m',
		blue: '\x1b[34m',
		magenta: '\x1b[35m',
		cyan: '\x1b[36m',
		white: '\x1b[37m',
		normal: '\x1b[39m'
	},

	DEFAULT_MIN_LEVEL = 'info',
	DEFAULT_LEVELS = [{
			id: 'trace',
			color: 'white'
		}, {
			id: 'debug'
		}, {
			id: 'info'
		}, {
			id: 'warn',
			color: 'yellow'
		}, {
			id: 'error',
			color: 'red'
		}];

function defaultFormatter(messages, level, settings) {
	messages = messages.join(' ');
	if (settings.timestamp) {
		messages = (new Date()).toLocaleString() + ': ' + messages;
	}
	if (settings.prependLevel) {
		messages = '[' + level.id.toUpperCase() + '] ' + messages;
	}
	return messages;
}

function getLevelIndex(name, levels) {
	var i, len;
	for (i = 0, len = levels.length; i < len; i++) {
		if (levels[i].id === name) {
			return i;
		}
	}
	return -1;
}

function ensurePathExists(destination) {
	if (!fs.existsSync(destination)) {
		ensurePathExists(path.dirname(destination));
		fs.mkdirSync(destination);
	}
}

/**
 * Settings for creating a transport.
 *
 * @name module:transport-logger.TransportSettings
 * @type Object
 * @property {Boolean} [timestamp] Timestamps each log message with a UTC date (default false)
 * @property {Boolean} [prependLevel] Prepends each log message with the log level (default false)
 * @property {String} [minLevel] The minimum logging level (default DEFAULT_MIN_LEVEL)
 * @property {Function} [formatter] A function to format messages with
 * @property {String | stream.Writable} [destination] The path to the log file
 * @property {String} [name] The name of the stream
 * @property {Number} [maxLines] The maximum number of lines to log befor rolling over to a new file. This only
 		applies to file transports created using a string path for the destination.
 */
function Transport(settings, levels) {
	settings = settings || {};
	this.levels = levels;

	// Set the base settings
	this.settings = {
		levels: levels,
		timestamp: !!settings.timestamp,
		prependLevel: !!settings.prependLevel,
		colorize: !!settings.colorize,
		name: settings.name
	};

	// Parse the min logging level
	this.settings.minLevel = settings.hasOwnProperty('minLevel') ? settings.minLevel : DEFAULT_MIN_LEVEL;
	if (this.settings.minLevel && getLevelIndex(this.settings.minLevel, levels) === -1) {
		throw new Error('Invalid minimum logging level "' + this.settings.minLevel + '"');
	}

	// Determine the stream
	if (settings.destination) {
		if (typeof settings.destination === 'string' || settings.destination instanceof String) {
			ensurePathExists(path.dirname(settings.destination));
			this.stream = fs.createWriteStream(settings.destination, {
				flags: 'a'
			});
			this.destination = settings.destination;
			if (fs.existsSync(settings.destination)) {
				this.lineCount = fs.readFileSync(settings.destination).toString().split('\n').length;
			}
			if (typeof settings.maxLines != 'undefined') {
				this.maxLines = settings.maxLines;
			}
		} else if (['object', 'function'].indexOf(typeof settings.destination) !== -1 && settings.destination instanceof stream.Writable) {
			this.stream = settings.destination;
		} else {
			throw new Error('Invalid destination specified. A destination must be a string, a writable stream instance, or undefined');
		}
	}

	// Set/create the formatter method
	this.formatter = settings.formatter ? settings.formatter : defaultFormatter;
}

/**
 * Logs a message. All parameters are concatenated together with a space in between them
 *
 * @name module:transport-logger.Logger.log
 * @method
 * @param {arguments} messages The message or messages to log
 */
Transport.prototype.log = function log(messages, level) {
	var message,
		levels = this.levels,
		minLevel = this.settings.minLevel,
		minLevelIndex = getLevelIndex(minLevel, levels),
		levelIndex = levels.indexOf(level),
		archiveNumber = 1;
	if (minLevel && levelIndex >= minLevelIndex) {
		message = this.formatter(messages, level, this.settings).toString();
		if (this.stream) {
			this.stream.write(message + '\n');
			if (this.maxLines) {
				if (this.lineCount >= this.maxLines) {
					if (fs.existsSync(this.destination + '.1')) {
						while(fs.existsSync(this.destination + '.' + ++archiveNumber)) {}
					}
					this.stream.end();
					fs.renameSync(this.destination, this.destination + '.' + archiveNumber);
					this.stream = fs.createWriteStream(this.destination, {
						flags: 'a'
					});
					this.lineCount = 0;
				}
				this.lineCount++;
			}
		} else {
			if (this.settings.colorize) {
				message = colorMap[level.color || 'normal'] + message + colorMap.normal;
			}
			while(level && !console[level.id]) {
				level = levels[--levelIndex];
			}
			if (!level) {
				level = 'log';
			} else {
				level = level.id;
				if (level === 'trace') { // We don't want the stack trace printed for trace messages
					level = 'log';
				}
			}
			console[level](message);
		}
	}
};


/**
 * The global settings for the logger that applies to all transports
 *
 * @name module:transport-logger.GlobalSettings
 * @type Object
 * @property {Object} [levels] The log levels
 * @property {String} <log-level> The key specifies the log level, and the value specifies the color. Colors are one of
 *                                'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', and 'normal'
 */
/**
 * Creates a new logger instance
 *
 * @name module:transport-logger.Logger
 * @constructor
 * @param {TransportSettings | TransportSettings[]} [transports] The transports to use
 * @param {GlobalSettings} [settings] The global settings
 */
function Logger(transports, settings) {
	var i, len,
		transport,
		levels,
		transportInstances = [],
		names = {};

	// Normalize the inputs
	if (!transports) {
		transports = [{}];
	} else if (!Array.isArray(transports)) {
		transports = [transports];
	}
	settings = settings || {};
	levels = settings.levels || DEFAULT_LEVELS;

	// Create the transports
	for (i = 0, len = transports.length; i < len; i++) {
		transport = transports[i];
		if (transport.name) {
			names[transport.name] = 1;
		}
		transportInstances.push(new Transport(transport, levels));
	}

	// Create the log methods
	levels.forEach(function (level) {
		this[level.id] = function log() {
			var i, ilen, j, jlen,
				p,
				messages = Array.prototype.slice.call(arguments, 0),
				transportMessages = new Array(messages.length),
				areNamed = new Array(messages.length),
				areAnyNamed = false,
				message,
				isNamed;
			for (i = 0, ilen = messages.length; i < ilen; i++) {
				message = messages[i];
				isNamed = false;
				if (typeof message === 'object') {
					isNamed = true;
					for (p in message) {
						if (message.hasOwnProperty(p)) {
							if (!names[p]) {
								isNamed = false;
							}
						}
					}
				}
				areNamed[i] = isNamed;
				areAnyNamed = areAnyNamed || isNamed;
			}
			for (i = 0, ilen = transportInstances.length; i < ilen; i++) {
				if (areAnyNamed) {
					for (j = 0, jlen = messages.length; j < jlen; j++) {
						if (areNamed[j]) {
							transportMessages[j] = messages[j][transportInstances[i].settings.name];
						} else {
							transportMessages[j] = messages[j];
						}
					}
					transportInstances[i].log(transportMessages, level);
				} else {
					transportInstances[i].log(messages, level);
				}
			}
		};
	}.bind(this));
}

module.exports = Logger;
