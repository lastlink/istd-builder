const fs = require('fs-extra')
var unzip = require("unzip");
// copy ruby/main.db to tmp/main.db
fs.copy('../ruby.istd', './tmp/ruby.zip')
	.then(() => {
		console.log('success!');

		fs.createReadStream('./tmp/ruby.zip')
			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				var fileName = entry.path;
				var type = entry.type; // 'Directory' or 'File'
				var size = entry.size;
				if (fileName === "main.db") {
					console.log("main db copied")

					entry.pipe(fs.createWriteStream('./tmp/' + fileName))

				} else {
					entry.autodrain();
				}
			})
			.on('close', function () {
				console.log('file downloaded to ', '/tmp/imageresize/');
				console.log("finished")
				// const sequelize = new Sequelize('sqlit://tmp/main.db');
				// const db = require("./models/index.js")
				var db = require("./models");
				// read .csv and add new entries for assignments
				// console.log(db.assigments)
				db.assignments.findAll({ limit: 2 }).then(users => {
					  console.log(users)
				})
			});

	})
	.catch(err => console.error(err));

