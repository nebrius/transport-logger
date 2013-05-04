var exec = require('child_process').exec,
	spawn = require('child_process').spawn;

exec('jasmine-node', function (error, stderr) {
	if (!stderr.match('^USAGE:')) {
		console.error('It appears that jasmine-node is not installed. Please install it using "npm install -g jasmine-node"');
	} else {
		spawn('jasmine-node', [__dirname], {
			stdio: 'inherit'
		});
	}
});