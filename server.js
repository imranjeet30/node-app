require('dotenv').config();

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const db = require("./app/models");
const Role = db.role;
const User = db.user.User;

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
    // initial();
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

  function initial() {
    Role.create({
      id: 1,
      name: "user"
    });
   
    Role.create({
      id: 2,
      name: "moderator"
    });
   
    Role.create({
      id: 3,
      name: "admin"
    });
  }

const app = express();


const port = process.env.PORT;

const corsOptions = {
    origin:`http://localhost:${port}`
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
User.belongsToMany(Role, { through: 'userRole' });
Role.belongsToMany(User, { through: 'userRole' });

require("./app/routes/turorial.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/payment.routes")(app);

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to NodeJs application');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}. Access it at http://localhost:${port}`)
})
