/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('occurrences', {
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
		start_date: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		address: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		time_duration: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		room: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		notification_uid: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		icon_identifier: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		weekdays: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		type_identifier: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		course_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		time_offset: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		repeat_units: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		repeats: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		url: {
			type: DataTypes.STRING(2000),
			allowNull: true
		}
	}, {
		tableName: 'occurrences'
	});
};
