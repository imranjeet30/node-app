const verifySignup = require("../middlewares/verifySignUp");

module.exports = (app) => {
	const user = require("../controllers/user.controller");

	const router = require("express").Router();
	router.post(
		"/signup",
		[
			verifySignup.checkDuplicateUsernameOrEmail,
			verifySignup.checkRoleExisted,
		],
		user.signup,
	);
	
	router.post("/login", user.login);

	app.use("/api/user", router);
};
