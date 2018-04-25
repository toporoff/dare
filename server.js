#!/usr/bin/env node
const app = require('./index');
const config = require('./config');

app.listen(config.express.port, config.express.ip, error => {
	if (error) {
		console.error('Unable to listen for connections', error);
		process.exit(10);
	}
});