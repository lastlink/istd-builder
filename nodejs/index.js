// copy ruby/main.db to tmp/main.db
const fs = require('fs-extra')
var unzip = require("unzip");

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

					entry.pipe(fs.createWriteStream('./tmp/'+fileName));
				} else {
					entry.autodrain();
				}
			})

	})
	.catch(err => console.error(err))
	.then(() => {
		console.log("finished")
	})





// fs.copy('../ruby/main.db', './tmp/main.db')
//   .then(() => console.log('success!'))
//   .catch(err => console.error(err))

// read .csv and add new entries for assignments