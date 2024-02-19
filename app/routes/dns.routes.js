module.exports = (app) => {
	const dnsController = require("../controllers/dns.controller");

	const router = require("express").Router();

	router.get("/host", dnsController.getHostname);
	router.get("/reverse", dnsController.getReverseDNS);
	router.get("/getIPV4", dnsController.getIPV4);
	router.get("/cacheDNS", dnsController.cacheDNS);

    app.use("/api/dns", router);
};
