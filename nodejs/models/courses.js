/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('courses', {
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
		final_grade: {
			type: "double",
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		courseID: {
			type: DataTypes.STRING(200),
			allowNull: true
		},
		use_grades: {
			type: "bool",
			allowNull: true
		},
		order_index: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		has_final_grade: {
			type: "bool",
			allowNull: true
		},
		has_credits: {
			type: "bool",
			allowNull: true
		},
		semester_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		color_index: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		credits: {
			type: "double",
			allowNull: true
		}
	}, {
		tableName: 'courses'
	});
};
