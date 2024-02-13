module.exports = (app) => {
	const user = require("../controllers/user.controller");

	const router = require("express").Router();
	router.post("/", user.signup);
	router.post("/login", user.login);

	app.use("/api/user", router);
};