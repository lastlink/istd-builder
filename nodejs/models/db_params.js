/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('db_params', {
		name: {
			type: DataTypes.STRING(200),
			allowNull: true,
			primaryKey: true
		},
		value: {
			type: DataTypes.STRING(2000),
			allowNull: true
		},
		is_local: {
			type: "BOOL",
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'db_params'
	});
};
