module.exports = (sequelize, Sequelize) => {
	const Joi = require("joi");

	const schema = Joi.object({
		title: Joi.string().required(),
		description: Joi.string().required(),
		publish: Joi.boolean().required(),
	});

	const Tutorial = sequelize.define("tutorial", {
		title: {
			type: Sequelize.STRING,
		},
		description: {
			type: Sequelize.STRING,
		},
		publish: {
			type: Sequelize.BOOLEAN,
		},
	});

	const validate = (data) => {
		return schema.validate(data);
	};

	return { Tutorial, validate };
};
