const Razorpay = require("razorpay");
const crypto = require("crypto");
const secret_key = "1234567890";

exports.createOrder = async (req, res) => {
	try {
		// initializing razorpay
		const razorpay = new Razorpay({
			key_id: process.env.RAZORPAY_KEY_ID,
			key_secret: process.env.RAZORPAY_KEY_SECRET,
		});
		// setting up options for razorpay order.
		const options = {
			amount: req.body.amount,
			currency: req.body.currency,
			receipt: req.body.receipt,
			payment_capture: 1,
		};

		try {
			const response = await razorpay.orders.create(options);

			res.json({
				order_id: response.id,
				currency: response.currency,
				amount: response.amount,
			});
		} catch (err) {
			res.status(400).send(err);
		}
	} catch (err) {
		res.send({
			error: err.message,
		});
	}
};

exports.paymentCapture = (req, res) => {
	try {
		const data = crypto.createHmac("sha256", secret_key);
		data.update(JSON.stringify(req.body));

		const digest = data.digest("hex");

		if (digest === req.headers["x-razorpay-signature"]) {
			console.log("request is legit");

			//We can send the response and store information in a database.

			res.json({
				status: "ok",
			});
		} else {
			res.status(400).send("Invalid signature");
		}
	} catch (err) {
		res.send({
			error: err.message,
		});
	}
};

exports.refund = async (req, res) => {
	try {
		//Verify the payment Id first, then access the Razorpay API.

		const options = {
			payment_id: req.body.paymentId,

			amount: req.body.amount,
		};

		const razorpayResponse = await razorpay.refund(options);

		//We can send the response and store information in a database

		res.send("Successfully refunded");
	} catch (err) {
		res.send({ error: err.message });
	}
};
