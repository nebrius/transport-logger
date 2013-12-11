Transport Logger
================

A multi-transport logger inspired by [winston](https://github.com/flatiron/winston) with the goal of being simple and small while still retaining some of the flexibility found in larger multi-transport loggers like winston.

## Table of Contents
* [Basic usage](#basic-usage)
	* [Default logging](#default-logging)
	* [Customizing the output](#customizing-the-output)
	* [Logging to a file](#logging-to-a-file)
* [Using multiple transports](#using-multiple-transports)
* [Custom log levels](#custom-log-levels)
* [Named transports](#named-transports)
* [Formatter functions](#formatter-functions)
* [Complete API](#complete-api)
* [License](#license)

## Basic usage

Install via npm:

```
npm install transport-logger
```

### Default logging

Instantiating a logger without any arguments creates a console logger with five levels ('error', 'warn', 'info', 'debug', and 'trace') and a minimum logging level of 'info'.

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger();

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');
```

will print

```JavaScript
error
warn
info
```

### Customizing the output

The output can be customized as follows:

```JavaScript
var Logger = require('transport-logger'),
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
```

which will print

<pre>
<font color="#800">[ERROR] Sun May 05 2013 16:36:19 GMT-0700 (PDT): error</font>
<font color="#880">[WARN] Sun May 05 2013 16:36:19 GMT-0700 (PDT): warn</font>
[INFO] Sun May 05 2013 16:36:19 GMT-0700 (PDT): info
[DEBUG] Sun May 05 2013 16:36:19 GMT-0700 (PDT): debug
[TRACE] Sun May 05 2013 16:36:19 GMT-0700 (PDT): trace
</pre>

Further customization of output can be accomplished using a formatter callback function. Custom log levels can also be specified. For more information, read the [Complete API](#complete-api) section.

### Logging to a file

To log to a file, specify a path in the options object:

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger({
		destination: 'path/to/logfile'
	});

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');
```

When logging to a file, it may be useful to cap files at a certain size. Setting the maxLines option will cause the current log file to be moved to a new filed called [destination].# once maxLines number of lines is reached. The number at the end the filename is incremented each time a new file is archived, such that [destination].1 is older than [destination].2

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger({
		destination: 'path/to/logfile',
		maxLines: 5
	});

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace'); // Will cause a new log file to be created
logger.info('new'); // Will be the first line logged to the new file
```


## Using multiple transports

To log to multiple transports, specify an array of configuration options

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger([{
		destination: 'path/to/logfile',
		minLevel: 'trace'
	}, {
		minLevel: 'debug'
	}]);

logger.error('error');
logger.warn('warn');
logger.info('info');
logger.debug('debug');
logger.trace('trace');
```

To use the default console logger as one of the transports, just specify an empty object

## Custom log levels

To use custom log levels, specify an object mapping log level names to colors as the second argument to the Logger constructor:

```JavaScript
var Logger = require('transport-logger'),
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
```

Available colors are 'black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', and 'normal' (default terminal color). If not using colors, these can be any value.

Note: if one of the transports is a console transport and the log level is not a native console method, the closest log level that is on console will be found. For example, if [syslog](http://en.wikipedia.org/wiki/Syslog#Severity_levels) levels are defined, then emergency, alert, and critical are specified, they will be logged via ```console.error()```.

## Named transports

Each transport can have a name assigned to it, so that they can be referenced later. With named transports, you can specify a different message for each transport in a log. This can be used, for example, to log a message that is localized for the user to the console, but log a message that is localized for the developer to a file.

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger([{
		name: 'file',
		destination: 'path/to/logfile'
	},{
		name: 'console'
	}]);
logger.info({
	console: 'Dies ist eine Nachricht',
	file: 'This is a message'
})
```

## Formatter functions

If the built-in options are not sufficient for your logging needs, you can define a formatter function to perform any arbitrary formatting:

```JavaScript
var Logger = require('transport-logger'),
	logger = new Logger({
		formatter: function (messages, level, settings) {
			return level.id + '?' + messages.join('+');
		}
	});

logger.error('error', 'foo');
logger.warn('warn', 'foo');
logger.info('info', 'foo');
logger.debug('debug', 'foo');
logger.trace('trace', 'foo');
```

will print

```
error?error+foo
warn?warn+foo
info?info+foo
```

## Complete API

### Constructor

```JavaScript
new Logger(transports, settings);
```

#### Parameters

<table>
	<tr>
		<th>Name</th>
		<th>Type</th>
		<th>Description</th>
	</tr>
	<tr>
		<td>transports &lt;optional&gt;</td>
		<td>Object | Array[Object]</td>
		<td>The settings for the transport or transports</td>
	</tr>
	<tr>
		<td />
		<td colspan="2">
			<table>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>timestamp &lt;optional&gt;</td>
					<td>Boolean</td>
					<td>Timestamps each log message with a UTC date (default false)</td>
				</tr>
				<tr>
					<td>prependLevel &lt;optional&gt;</td>
					<td>Boolean</td>
					<td>Prepends each log message with the log level (default false)</td>
				</tr>
				<tr>
					<td>minLevel &lt;optional&gt;</td>
					<td>String</td>
					<td>The minimum logging level (default 'info'). If something falsey is passed in, then nothing is logged. This can be used to implement a --silent flag in the application</td>
				</tr>
				<tr>
					<td>formatter &lt;optional&gt;</td>
					<td>Function</td>
					<td>A function to format messages with. An array of all messages to log is passed in as the only argument. The formatter function shall return a string that is logged</td>
				</tr>
				<tr>
					<td>destination &lt;optional&gt;</td>
					<td>String | stream.Writable</td>
					<td>The path to the log file, or an existing stream. If a file path is specified, it does not have to exist already. If the file exists, new log messages are appended to the existing contents. Takes precedence over the stream property.</td>
				</tr>
				<tr>
					<td>name &lt;optional&gt;</td>
					<td>String</td>
					<td>The name of the transport</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td>settings &lt;optional&gt;</td>
		<td>Object</td>
		<td>The global settings that apply to all transports</td>
	</tr>
	<tr>
		<td />
		<td colspan="2">
			<table>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Description</th>
				</tr>
				<tr>
					<td>levels</td>
					<td>Object</td>
					<td>The custom levels for the logger</td>
				</tr>
				<tr>
					<td />
					<td colspan="2">
						<table>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Description</th>
						</tr>
						<tr>
							<td>&lt;level name&gt;</td>
							<td>String</td>
							<td>Each level name is specified as a key, and it's log color is the value</td>
						</tr>
					</td>
				</tr>
			</table>
		</td>
	</table>
</table>

#### Returns

An instance of the logger. Each logger instance has a method that corresponds with each log level. Each method takes an arbitrary number of arguments, converts them to strings, and contatenates them with a space in between them.

## License

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
