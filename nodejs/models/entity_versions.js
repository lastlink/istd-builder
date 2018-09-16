/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('entity_versions', {
		name: {
			type: DataTypes.STRING(200),
			allowNull: true,
			primaryKey: true
		},
		rev: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: '0'
		}
	}, {
		tableName: 'entity_versions'
	});
};
