const express = require("express");
const app = express();
const User = require("./userModel");
const sequelize = require("./sequelize");
const userRoutes = require("./userRoutes");

app.use(express.json());
app.use("/api/v1/users", userRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");

    sequelize
      // .sync({ force: true })
      // .sync({ alter: true })
      .sync()
      .then((result) => {
        app.listen(3030, () => {
          console.log(`✔ Server is listening at port 3030`);
        });
      })
      .catch((err) => {
        console.error("Error while creating tables...");
        console.log(err.message);
      });
  })
  .catch((error) => console.error("Unable to connect to the database:", error));
