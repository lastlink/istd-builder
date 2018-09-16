/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('exams', {
		uid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		is_new: {
			type: "BOOL",
			allowNull: false,
			defaultValue: '0'
		},
		is_local: {
			type: "BOOL",
			allowNull: false,
			defaultValue: '0'
		},
		DEL: {
			type: "BOOL",
			allowNull: false,
			defaultValue: '0'
		},
		server_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		old_server_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		building: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		all_day: {
			type: "bool",
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		completion_day: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		weight_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		complete: {
			type: "bool",
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		date: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		time_duration: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		room: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		earned_points: {
			type: "double",
			allowNull: true
		},
		course_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		total_points: {
			type: "double",
			allowNull: true
		},
		time_offset: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		url: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		completion_time_offset: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'exams'
	});
};
