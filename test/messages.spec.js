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
	exec = require('child_process').exec,
	fs = require('fs');

describe('Messages tests', function() {

	it('Multiple Messages', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '1-multiple_messages'), {
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
			expect(output.stdout).toEqual('1 2 3 4 5\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Console Stress', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '2-console_stress'), {
				cwd: __dirname,
				maxBuffer: 100000000
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
			var data = '',
				i, len = 1;
			while(len <= 1000000) {
				for (i = 0; i < len; i++) {
					data += i + ':';
				}
				data += '$\n';
				len *= 10;
			}
			expect(output.stdout).toEqual(data);
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('File Stress', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '3-file_stress'), {
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
			var data = '',
				i, len = 1,
				logPath = output.stdout.trim(),
				contents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			while(len <= 1000000) {
				for (i = 0; i < len; i++) {
					data += i + ':';
				}
				data += '$\n';
				len *= 10;
			}
			expect(contents).toEqual(data);
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Console and File Stress', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '4-console_and_file_stress'), {
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
			var data = '',
				i, len = 1,
				consoleContents = output.stdout.trim(),
				logPath = consoleContents.substring(consoleContents.lastIndexOf('\n') + 1),
				fileContents = fs.readFileSync(logPath).toString();
			fs.unlinkSync(logPath);
			consoleContents = consoleContents.substring(0, consoleContents.length - logPath.length);
			while(len <= 100) {
				for (i = 0; i < len; i++) {
					data += i + ':';
				}
				data += '$\n';
				len *= 10;
			}
			expect(consoleContents).toEqual(data);
			expect(fileContents).toEqual(data);
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Silent logging', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '6-silent'), {
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
			expect(output.stdout).toEqual('');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});

	it('Named transports', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'messages', '7-named'), {
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
			var consoleContents = output.stdout.trim(),
				logPath = consoleContents.substring(consoleContents.lastIndexOf('\n') + 1),
				logPath1 = logPath.split(':')[0],
				logPath2 = logPath.split(':')[1],
				file1Contents = fs.readFileSync(logPath1).toString(),
				file2Contents = fs.readFileSync(logPath2).toString();
			fs.unlinkSync(logPath1);
			fs.unlinkSync(logPath2);
			consoleContents = consoleContents.substring(0, consoleContents.length - logPath.length);
			expect(consoleContents).toEqual('a-console common\n');
			expect(file1Contents).toEqual('a-file-1 common\n');
			expect(file2Contents).toEqual('a-file-2 common\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});
});
