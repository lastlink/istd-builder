const fs = require('fs-extra')
const unzip = require("unzip");
const csv = require('csv-parser');
const archiver = require('archiver');
const MAINCONFIG = require('./config/mainconfig.js');

// get most recent date from input
fs.copy('./input/' + MAINCONFIG.istdSettings.inputFile + '.istd', './tmp/tmp.zip')
	.then(() => {
		console.log('success!');

		fs.createReadStream('./tmp/tmp.zip')
			.pipe(unzip.Parse())
			.on('entry', function (entry) {
				var fileName = entry.path;
				var type = entry.type; // 'Directory' or 'File'
				var size = entry.size;
				if (fileName === "main.db" || fileName === "meta.xml") {
					console.log(fileName + " copied")

					entry.pipe(fs.createWriteStream('./istd/' + fileName))

				} else {
					entry.autodrain();
				}
			})
			.on('close', function () {
				console.log("finished")
				const db = require("./models");
				// console.log(db.assigments)
				// db.assignments.findAll({ limit: 2 }).then(users => {
				// 	console.log(users)
				// })
				var entryNum = 1;
				// read .csv and add new entries for assignments
				fs.createReadStream("./input/assignments_template.csv")
					.pipe(csv())
					.on('data', function (data) {
						console.log("---- entry " + entryNum + " ------")
						try {
							// grab id
							console.log("name is: " + data.name);
							// clientDataIds.push(data.id)

							//perform the operation
							db.sequelize.transaction(function (t) {
								// search for course by name, if it doesn't exist then creat it.
								return db.assignments.create({
									is_new: 1,
									is_local: 1,
									notes: data.notes,
									due_date: MAINCONFIG.istdSettings.defaultDueDate,
									course_uid: MAINCONFIG.istdSettings.def_course_uid,
									name: data.name
								}, { transaction: t }).then(function (newRow) {
									// return newRow.setShooter({
									//   firstName: 'John',
									//   lastName: 'Boothe'
									// }, {transaction: t});
								});
							}).then(function (result) {
								console.log(result)
								// Transaction has been committed
								// result is whatever the result of the promise chain returned to the transaction callback
							}).catch(function (err) {
								console.log(err)

								// Transaction has been rolled back
								// err is whatever rejected the promise chain returned to the transaction callback
							});

						}
						catch (err) {
							console.log(err)
							//error handler
						}
					})
					.on('end', function () {

						console.log("finished iterating over assignments")
						db.sequelize.sync({ force: false })
							.then(() => {
								console.log("finished db inserts")
								// rezip
								var output = fs.createWriteStream(__dirname + '/istudiez.istd');
								var archive = archiver('zip');
								output.on('close', function () {
									console.log(archive.pointer() + ' total bytes');
									console.log('archiver has been finalized and the output file descriptor has closed.');
								});
								output.on('end', function () {
									console.log('Data has been drained');
								});
								archive.on('error', function (err) {
									throw err;
								});
								// archive.on('progress', function(progress) {
								// 	var percent = 100 - ((totalSize - progress.fs.processedBytes) / totalSize) * 100;

								// 	console.log('%s / %s (%d %)', bytesToSize(progress.fs.processedBytes), prettyTotalSize, percent);
								//   })
								archive.pipe(output);


								archive.directory('istd/', false);

								archive.finalize();
							})


					})
			});

	})
	.catch(err => console.error(err));

