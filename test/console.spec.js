/*global
describe,
it,
expect,
runs,
waitsFor
*/

var path = require('path'),
	exec = require('child_process').exec;

describe('Console tests', function() {

	it('Console 1: Default values', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '1-default_values'), {
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
			expect(output.stdout).toEqual('info\n');
			expect(output.stderr).toEqual('error\nwarn\n');
			expect(output.error).toBeNull();
		});
	});

	it('Console 2: All Log Levels', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '2-all_log_levels'), {
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
			expect(output.stdout).toEqual('info\ndebug\ntrace\n');
			expect(output.stderr).toEqual('error\nwarn\n');
			expect(output.error).toBeNull();
		});
	});

	it('Console 3: Colorize', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '3-colorize'), {
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
			expect(output.stdout).toEqual('\u001b[39minfo\u001b[39m\n\u001b[39mdebug\u001b[39m\n\u001b[37mtrace\u001b[39m\n');
			expect(output.stderr).toEqual('\u001b[31merror\u001b[39m\n\u001b[33mwarn\u001b[39m\n');
			expect(output.error).toBeNull();
		});
	});
});
