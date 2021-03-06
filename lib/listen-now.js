'use strict';

const path = require('path');
const fs = require('fs');
const notify = require('node-notifier');
const imgur = require('./imgur');

module.exports = (directory) => {
	fs.stat(directory, (error, stats) => {
		if (error) {
			return notify.notify({
				title: 'Imgur-CLI',
				message: `Directory ${directory} not found`
			});
		}

		if (stats.isDirectory()) {
			let trigger;

			console.log(`Listening to ${directory}`);

			fs.watch(directory, (event, filename) => {
				if (path.extname(filename) === '.jpeg' ||
						path.extname(filename) === '.jpg' ||
						path.extname(filename) === '.gif' ||
						path.extname(filename) === '.png' &&
						!trigger) {
							trigger = setTimeout(() => {
								notify.notify({
									title: 'Imgur-CLI',
									message: `${directory + '/' + filename} added`
								});

								imgur(`${directory + '/' + filename}`);

								trigger = null;
							}, 1000);
				}
			});
		}
	});
}
