const { DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false, // allowNull defaults to true
    trim: true,
    lowercase: true,
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = User;
