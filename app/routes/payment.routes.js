module.exports = (app) => {
    const payment = require("../controllers/payment.controller");

    const router = require("express").Router();

    router.post('/create-order', payment.createOrder);

    app.use("/api/payment", router);
}