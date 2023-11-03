'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ball extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ball.init({
    name: DataTypes.STRING,
    volume: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'ball',
  });
  return ball;
};