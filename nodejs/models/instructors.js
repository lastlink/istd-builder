/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('instructors', {
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
		title: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		emails: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		pages: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		phones: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		name: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		office_hours: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		company: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		image_data: {
			type: "blob",
			allowNull: true
		},
		department: {
			type: DataTypes.STRING(2000),
			allowNull: true
		}
	}, {
		tableName: 'instructors'
	});
};
