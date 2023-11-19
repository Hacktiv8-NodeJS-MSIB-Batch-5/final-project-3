'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {
        foreignKey: "ProductId",
        as: "Product",
      });
      this.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "User",
      });
    }
  }
  TransactionHistory.init({
    ProductId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "quantity must be an integer/number"
        },
        notEmpty: {
          args: true,
          msg: "quantity is required"
        },
        notNull: {
          args: true,
          msg: "quantity is required"
        },
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "total_price must be an integer/number"
        },
        notEmpty: {
          args: true,
          msg: "total_price is required"
        },
        notNull: {
          args: true,
          msg: "total_price is required"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'TransactionHistory',
  });
  return TransactionHistory;
};