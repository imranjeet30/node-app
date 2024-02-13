module.exports = (sequelize, Sequelize) => {
	const Joi = require("joi");

	const schema = Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required(),
		roles: Joi.array().items()
	});

	const User = sequelize.define("user", {
		firstName: {
			type: Sequelize.STRING,
		},
		lastName: {
			type: Sequelize.STRING,
		},
		email: {
			type: Sequelize.STRING,
		},
		password: {
			type: Sequelize.STRING,
		},
	});

	const validate = (user) => {
		return schema.validate(user);
	};

    // User.associate = (models) => {
	// 	User.belongsTo(models.Role, { through: "userRole" });
	// };

	return {
		User,
		validate,
	};
};
