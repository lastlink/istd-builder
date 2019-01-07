const fs = require('fs-extra')
const unzip = require("unzip");
const csv = require('csv-parser');
const archiver = require('archiver');
const MAINCONFIG = require('./config/mainconfig.js');
var log = require('log-to-file');

var startTime, endTime;
startTime = new Date();

function end() {
	endTime = new Date();
	var timeDiff = endTime - startTime; //in ms
	// strip the ms
	timeDiff /= 1000;

	// get seconds 
	var seconds = Math.round(timeDiff);
	// console.log(seconds + " seconds");
	return "- in " + seconds + " seconds";
}

// get most recent date from input
fs.copy('./input/' + MAINCONFIG.istdSettings.inputFile + '.istd', './tmp/tmp.zip')
	.then(() => {
		console.log('success!' + end());

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
				console.log("finished" + end())
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
						console.log("---- entry " + entryNum + " ------" + end())
						console.log("name is: " + data.name);
						console.log(JSON.stringify(data))
						try {
							// grab id
							// clientDataIds.push(data.id)
							var assignmentObj = {
								is_new: 1,
								is_local: 1,
								notes: data.notes,
								due_date: data.due_date || MAINCONFIG.istdSettings.defaultDueDate,
								course_uid: data.course_name || MAINCONFIG.istdSettings.def_course_uid,
								name: data.name,
								priority: data.priority
							}
							// if notify time provided them fill it out and set notify to true (1)
							if (data.notify) {
								assignmentObj.notification_time = data.notify;
								assignmentObj.notify = 1
							}
							console.log(JSON.stringify(assignmentObj))
							//perform the operation, TODO bulk insert, getting database locked on more than 5 records
							setTimeout(function () {
								console.log('protection against db lockups');

								db.sequelize.transaction(function (t) {
									// search for course by name, if it doesn't exist then creat it.

									return db.assignments.create(assignmentObj, { transaction: t }).then(function (newRow) {
										// return newRow.setShooter({
										//   firstName: 'John',
										//   lastName: 'Boothe'
										// }, {transaction: t});
									});
								}).then(function (result) {
									console.log("Commit successful:")
									console.log(result)
									// Transaction has been committed
									// result is whatever the result of the promise chain returned to the transaction callback
								}).catch(function (err) {
									console.log("Transaction error rolling back:")
									console.log(err)
									log(err);

									// Transaction has been rolled back
									// err is whatever rejected the promise chain returned to the transaction callback
								});
								// protection against db lockups

							}, 1500);

						}
						catch (err) {
							console.log("Major error:")
							console.log(err)
							log(err);
							//error handler
						}
						// exit();

					})
					.on('end', function () {

						console.log("finished iterating over assignments" + end())
						db.sequelize.sync({ force: false })
							.then(() => {
								console.log("finished db inserts" + end())
								// rezip
								var output = fs.createWriteStream(__dirname + '/istudiez.istd');
								var archive = archiver('zip');
								output.on('close', function () {
									console.log(archive.pointer() + ' total bytes');
									console.log('archiver has been finalized and the output file descriptor has closed.' + end());
								});
								output.on('end', function () {
									console.log('Data has been drained' + end());
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
	.catch(err => {
		console.error(err); log(err);
	});

