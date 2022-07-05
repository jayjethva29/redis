const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("socket_crud", "root", "jay@2912", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
