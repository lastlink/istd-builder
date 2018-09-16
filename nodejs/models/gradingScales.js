/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('gradingScales', {
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
		name: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		min: {
			type: "double",
			allowNull: true
		},
		max: {
			type: "double",
			allowNull: true
		},
		course_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'gradingScales'
	});
};
