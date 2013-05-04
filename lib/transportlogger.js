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

var stream = require('stream'),
	fs = require('fs'),

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

/**
 * Creates a logging transport.
 *
 * @param {Object} [settings] The settings for the transport
 * @param {Boolean} [settings.timestamp] Timestamps each log message with a UTC date (default false)
 * @param {Boolean} [settings.prependLevel] Prepends each log message with the log level (default false)
 * @param {String} [settings.minLevel] The minimum logging level (default DEFAULT_MIN_LEVEL)
 * @param {Function} [settings.formatter] A function to format messages with
 * @param {String} [settings.path] The path to the log file
 * @param {stream.Writable} [settings.stream] The stream to write to
 */
function Transport(settings, levels) {
	settings = settings || {};
	this.levels = levels;

	// Set the base settings
	this.settings = {
		levels: levels,
		timestamp: !!settings.timestamp,
		prependLevel: !!settings.prependLevel,
		colorize: !!settings.colorize
	};

	// Parse the min logging level
	this.settings.minLevel = settings.hasOwnProperty('minLevel') ? settings.minLevel : DEFAULT_MIN_LEVEL;
	if (getLevelIndex(this.settings.minLevel, levels) === -1) {
		throw new Error('Invalid minimum logging level "' + this.settings.minLevel + '"');
	}

	// Determine the stream
	if (settings.stream) {
		if (!settings.stream instanceof stream.Writable) {
			throw new Error('Stream argument ' + settings.stream.toString() + ' must be an instance of stream.Writable');
		}
		this.stream = settings.stream;
	} else if (settings.file) {
		this.stream = fs.createWriteStream(settings.file, {
			flags: 'a'
		});
	}

	// Set/create the formatter method
	this.formatter = settings.formatter ? settings.formatter : defaultFormatter;
}
Transport.prototype.log = function log(messages, level) {
	var message,
		levels = this.levels,
		minLevel = this.settings.minLevel,
		minLevelIndex = getLevelIndex(minLevel, levels),
		levelIndex = levels.indexOf(level);
	if (levelIndex >= minLevelIndex) {
		message = this.formatter(messages, level, this.settings).toString();
		if (this.stream) {
			this.stream.write(message + '\n');
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
				if (level === 'trace') { // We don't want the stack trace printed for trace
					level = 'log';
				}
			}
			console[level](message);
		}
	}
};

/**
 * Initializes the logger
 *
 * @param {Array[Transport] | Transport} transports The transports to use
 * @param {Object} [settings] The global settings
 */
function Logger(transports, settings) {
	var i, len,
		transport,
		levels,
		transportInstances = [];

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
		transportInstances.push(transport instanceof Transport ? transport : new Transport(transport, levels));
	}

	// Create the log methods
	levels.forEach(function (level) {
		this[level.id] = function log() {
			var i, len,
				messages = Array.prototype.slice.call(arguments, 0);
			for (i = 0, len = transportInstances.length; i < len; i++) {
				transportInstances[i].log(messages, level);
			}
		};
	}.bind(this));
}

module.exports = Logger;