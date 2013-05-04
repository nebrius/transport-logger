/*global
describe,
it,
expect,
runs,
waitsFor
*/

var path = require('path'),
	exec = require('child_process').exec,
	dateRegex = '[A-Z][a-z]{2} [A-Z][a-z]{2} [0-9]{2} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2}.*';

describe('Console tests', function() {

	it('Default values', function() {
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

	it('All Log Levels', function() {
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

	it('Colorize', function() {
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

	it('Timestamp', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '4-timestamp'), {
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
			expect(output.stdout).toMatch(new RegExp('^' + dateRegex + ': info\n' + dateRegex + ': debug\n' + dateRegex + ': trace\n' + '$', 'm'));
			expect(output.stderr).toMatch(new RegExp('^' + dateRegex + ': error\n' + dateRegex + ': warn\n' + '$', 'm'));
			expect(output.error).toBeNull();
		});
	});

	it('Prepend Level', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '5-prepend_level'), {
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
			expect(output.stdout).toEqual('[INFO] info\n[DEBUG] debug\n[TRACE] trace\n');
			expect(output.stderr).toEqual('[ERROR] error\n[WARN] warn\n');
			expect(output.error).toBeNull();
		});
	});

	it('All The Trimmings', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '6-all_the_trimmings'), {
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
			expect(output.stdout).toMatch(new RegExp('^\u001b\\[39m\\[INFO\\] ' + dateRegex + ': info\u001b\\[39m\n\u001b\\[39m\\[DEBUG\\] ' +
				dateRegex + ': debug\u001b\\[39m\n\u001b\\[37m\\[TRACE\\] ' + dateRegex + ': trace\u001b\\[39m\n$', 'm'));
			expect(output.stderr).toMatch(new RegExp('^\u001b\\[31m\\[ERROR\\] ' + dateRegex + ': error\u001b\\[39m\n\u001b\\[33m\\[WARN\\] ' +
				dateRegex + ': warn\u001b\\[39m\n$', 'm'));
			expect(output.error).toBeNull();
		});
	});

	it('Custom Levels', function() {
		var finished = false,
			output;
		runs(function () {
			exec('node ' + path.join('tests', 'console', '7-custom_levels'), {
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
			expect(output.stdout).toEqual('\u001b[32mb\u001b[39m\n\u001b[34mc\u001b[39m\n\u001b[36md\u001b[39m\n\u001b[35me\u001b[39m\n');
			expect(output.stderr).toEqual('');
			expect(output.error).toBeNull();
		});
	});
});
