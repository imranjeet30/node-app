require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require("./app/models");

// db.sequelize.sync()
//   .then(() => {
//     console.log("Synced db.");
//   })
//   .catch((err) => {
//     console.log("Failed to sync db: " + err.message);
//   });

const app = express();


const port = process.env.PORT;

const corsOptions = {
    origin:`http://localhost:${port}`
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
require("./app/routes/turorial.routes")(app);
// Routes
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs application');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}. Access it at http://localhost:${port}`)
})
