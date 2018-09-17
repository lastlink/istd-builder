'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
// const assignmentModel = require('./assignments')
// const courseModel = require('./courses')
// const semesterModel = require('./semesters')
// const instructorModel = require('./instructors')

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

let sequelize;
if (config.use_env_variable) {
  console.log("used")
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log("not used")
  console.log(config)
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// const assignments = assignmentModel(sequelize, Sequelize)

// console.log("testing db")
// console.log(assigments.findAll())
// const courses = courseModel(sequelize, Sequelize)
// const semesters = semesterModel(sequelize, Sequelize)
// const instructors = instructorModel(sequelize, Sequelize)

// assignments.belongsTo(courses);

const db = {}
// const db = {
//   assignments,
//   courses,
//   semesters,
//   instructors
// };

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// sequelize.sync({ force: false })
//   .then(() => {
//     console.log(`Database & tables created!`)
//     // Blog.findAll().then(users => {
//     //   console.log(users)
//     // })
//     // console.log(Blog.findAll())
//   })

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
