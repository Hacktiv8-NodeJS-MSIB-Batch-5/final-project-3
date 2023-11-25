'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Category, {
        foreignKey: "CategoryId",
        as: "Category"
      });
    }
  }
  Product.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "title is required"
        },
        notNull: {
          args: true,
          msg: "title is required"
        },
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "price must be an integer/number"
        },
        min: {
          args: [0],
          msg: "price must not be less than 0"
        },
        max: {
          args: [50000000],
          msg: "price must not be more than 50000000"
        },
        notEmpty: {
          args: true,
          msg: "price is required"
        },
        notNull: {
          args: true,
          msg: "price is required"
        },
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "stock must be an integer/number"
        },
        min: {
          args: [5],
          msg: "stock must not drop below 5"
        },
        notEmpty: {
          args: true,
          msg: "stock is required"
        },
        notNull: {
          args: true,
          msg: "stock is required"
        },
      }
    },
    CategoryId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};