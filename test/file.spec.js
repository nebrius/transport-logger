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
