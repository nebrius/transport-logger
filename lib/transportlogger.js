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

	DEFAULT_MIN_LEVEL = 'info',
	DEFAULT_LEVELS = [
		{
			id: 'trace',
			color: 'gray'
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
		}
	];

function defaultFormatter(messages, level, settings) {
	messages = messages.join(' ');
	if (settings.timestamp) {
		messages = (new Date()).toLocaleString() + ': ' + messages;
	}
	if (settings.prependLevel) {
		messages = '[' + level.toUpperCase() + '] ' + messages;
	}
	return messages;
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
	if (levels.indexOf(this.settings.minLevel) === -1) {
		throw new Error('Invalid minimum logging level "' + this.settings.minLevel + '"');
	}

	// Determine the stream
	if (settings.stream) {
		if (!settings.stream instanceof stream.Writable) {
			throw new Error('Stream argument ' + settings.stream.toString() + ' must be an instance of stream.Writable');
		}
		this.stream = settings.stream;
	} else if (settings.path) {
		this.stream = fs.createWriteStream(settings.path, {
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
		levelIndex = -2,
		minLevelIndex = -1,
		i, len;
	for (i = 0, len = levels.length; i < len; i++) {
		if (levels[i].id === level) {
			levelIndex = i;
		}
		if (levels[i].id === minLevel) {
			minLevelIndex = i;
		}
	}
	if (levelIndex >= minLevelIndex) {
		message = this.formatter(messages, level, this.settings).toString();
		if (this.stream) {
			this.stream.write(message + '\n');
		} else {
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
		levels;

	// Normalize the inputs
	if (!transports) {
		transports = [{}];
	} else if (!Array.isArray(transports)) {
		transports = [transports];
	}
	settings = settings || {};
	levels = settings.levels || DEFAULT_LEVELS;

	// Create the transports
	this.transports = [];
	for (i = 0, len = transports.length; i < len; i++) {
		transport = transports[i];
		this.transports.push(transport instanceof Transport ? transport : new Transport(transport, levels));
	}

	// Create the log methods
	levels.forEach(function (level) {
		this[level.id] = function log() {
			var i, len,
				message = Array.prototype.slice.call(arguments, 0);
			for (i = 0, len = this.transports.length; i < len; i++) {
				this.transports[i].log(message, level);
			}
		};
	}.bind(this));
}

module.exports = Logger;