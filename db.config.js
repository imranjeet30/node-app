module.exports = {
	HOST: "localhost",
	USER: "root",
	PASSWORD: "Ranjeet!@#",
	DB: "testdb",
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		idle: 10000,
		acquire: 30000,
	},
};
