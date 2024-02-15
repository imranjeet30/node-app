const db = require("../models");
const Tutorial = db.tutorials.Tutorial;
const validate = db.tutorials.validate;
const Op = db.Sequelize.Op;

/**
 * Creates record
 * @param {Object} req
 * @param {Object} res
 */
exports.create = async (req, res) => {
	try {
		let isValidated = validate(req.body);
		if (!!isValidated?.error) {
			return res.send({
				data: isValidated?.error?.details.map((v) => v.message),
			});
		}

		const result = await Tutorial.create(req.body);
		res.send({ data: result });
	} catch (err) {
		res.send({ error: err.message });
	}
};

/**
 * Gets all records
 * @param {Object} req
 * @param {Object} res
 */
exports.get = async (req, res) => {
	try {
		const title = req.query.title;
		const condition = title ? { title } : null;

		const result = await Tutorial.findAll({
			where: condition,
		});

		res.send({ data: result });
	} catch (err) {
		res.send({ data: err.message });
	}
};

/**
 * Gets single record
 * @param {Object} req
 * @param {Object} res
 */
exports.findOne = async (req, res) => {
	try {
		const id = req.params.id;
		const result = await Tutorial.findByPk(id);

		res.send({ data: result });
	} catch (err) {
		res.send({ data: err.message });
	}
};

/**
 * Deletes records
 * @param {Object} req
 * @param {Object} res
 */
exports.delete = async (req, res) => {
	try {
		const id = req.params.id;

		await Tutorial.destroy({
			where: { id },
		});

		res.send({
			data: `Record deleted successfully for id ${id}`,
		});
	} catch (err) {
		res.send({ data: err.message });
	}
};

/**
 * Updates record
 * @param {Object} req
 * @param {Object} res
 */
exports.update = async (req, res) => {
	try {
		let id = req.params.id;

		await Tutorial.update(req.body, {
			where: { id },
		});

		res.send({
			data: `Record updated successfully for id ${id}`,
		});
	} catch (err) {
		res.send({ data: err.message });
	}
};

/**
 * Gets published records
 * @param {Object} req
 * @param {Object} res
 */
exports.getPublished = async (req, res) => {
	try {
		let isPublished = req.params.isPublished;

		const result = await Tutorial.findAll({
			where: {
				publish: isPublished,
			},
		});

		res.send({
			data: result,
		});
	} catch (err) {
		res.send({ data: err.message });
	}
};

exports.upload = async (req, res) => {
	try {
		if (req.file == undefined) {
			return res.status(400).send("Please upload a CSV file!");
		}

		let tutorials = [];
		let path =
			__basedir + "/resources/static/assets/uploads/" + req.file.filename;

		fs.createReadStream(path)
			.pipe(csv.parse({ headers: true }))
			.on("error", (error) => {
				throw error.message;
			})
			.on("data", (row) => {
				tutorials.push(row);
			})
			.on("end", () => {
				Tutorial.bulkCreate(tutorials)
					.then(() => {
						res.status(200).send({
							message:
								"Uploaded the file successfully: " +
								req.file.originalname,
						});
					})
					.catch((error) => {
						res.status(500).send({
							message: "Fail to import data into database!",
							error: error.message,
						});
					});
			});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			message: "Could not upload the file: " + req.file.originalname,
		});
	}
};
