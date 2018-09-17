/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('assignments', {
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
		notification_day: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		due_date: {
			type: DataTypes.INTEGER,
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
		partners: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		notification_uid: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		priority: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		earned_points: {
			type: "double",
			allowNull: true
		},
		notification_time: {
			type: "double",
			allowNull: true
		},
		course_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notify: {
			type: "bool",
			allowNull: true
		},
		total_points: {
			type: "double",
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		completion_time_offset: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'assignments',
		timestamps: false
	});
};
