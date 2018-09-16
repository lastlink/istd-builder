/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('links_occurrence_to_instructors', {
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
		occurrence_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		instructor_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'links_occurrence_to_instructors'
	});
};
