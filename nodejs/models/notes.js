/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('notes', {
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
		event_uid: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		content: {
			type: DataTypes.STRING(1024),
			allowNull: true
		}
	}, {
		tableName: 'notes'
	});
};
