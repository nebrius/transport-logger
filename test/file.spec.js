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

/*global
describe,
it,
expect,
runs,
waitsFor
*/

var path = require('path'),
	fs = require('fs'),
	exec = require('child_process').exec,
	dateRegex = '[A-Z][a-z]{2} [A-Z][a-z]{2} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}.*';

describe('Console tests', function() {

	it('Default values', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '1-default_values'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toEqual('error\nwarn\ninfo\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('All Log Levels', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '2-all_log_levels'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toEqual('error\nwarn\ninfo\ndebug\ntrace\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Colorize', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '3-colorize'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toEqual('error\nwarn\ninfo\ndebug\ntrace\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Timestamp', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '4-timestamp'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toMatch(new RegExp('^' + dateRegex + ': error\n' + dateRegex + ': warn\n' + dateRegex + ': info\n' + dateRegex + ': debug\n' + dateRegex + ': trace\n' + '$', 'm'));
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Prepend Level', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '5-prepend_level'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toEqual('[ERROR] error\n[WARN] warn\n[INFO] info\n[DEBUG] debug\n[TRACE] trace\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('All The Trimmings', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '6-all_the_trimmings'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toMatch(new RegExp('^\\[ERROR\\] ' + dateRegex + ': error\n\\[WARN\\] ' +
				dateRegex + ': warn\n\\[INFO\\] ' + dateRegex + ': info\n\\[DEBUG\\] ' +
				dateRegex + ': debug\n\\[TRACE\\] ' + dateRegex + ': trace\n$', 'm'));
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Custom Levels', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'file', '7-custom_levels'), {
				cwd: __dirname
			}, function (error, stdout, stderr) {
				finished = true;
				output = {
					stdout: stdout.replace('\n\r', '\n'),
					stderr: stderr.replace('\n\r', '\n'),
					error: error
				};
			});
		});
		waitsFor(function () {
			return finished;
		});
		runs(function () {
			var logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			expect(contents).toEqual('b\nc\nd\ne\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});
});
