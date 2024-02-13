const User = require("./user.model");

module.exports = (sequelize, Sequelize) => {
	const Role = sequelize.define("role", {
		name: {
			type: Sequelize.STRING,
		},
	});

	// Role.associate = (models) => {
	// 	Role.belongsTo(models.User, { through: "userRole" });
	// };

	return Role;
};
