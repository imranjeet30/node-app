const authJwt = require("../middlewares/authJwt");

module.exports = (app) => {
	const tutorial = require("../controllers/tutorial.controller");

	const router = require("express").Router();
	router.post("/", tutorial.create);
	router.get("/", tutorial.get);
	router.get("/:id", tutorial.findOne);
	router.delete("/:id", tutorial.delete);
	router.put("/", tutorial.update);
	router.get("/published/:isPublished", tutorial.getPublished);

	app.use("/api/tutorials", [authJwt.verifyToken], router);
};
