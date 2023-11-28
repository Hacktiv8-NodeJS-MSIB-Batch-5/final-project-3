'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Product, {
        foreignKey: "CategoryId",
        as: "Products"
      })
    }
  }
  Category.init({
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "type is required"
        },
        notNull: {
          args: true,
          msg: "type is required"
        },
      }
    },
    sold_product_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          args: true,
          msg: "sold_product_amount must be integer/number"
        },
        notNull: {
          args: true,
          msg: "sold_product_amount cannot be null"
        },
        // min: {
        //   args: 0,
        //   msg: "sold_product_amount must not be less than 0"
        // },
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
    // hooks: {
    //   beforeCreate: (category, args) => {
    //     category.sold_product_amount = 0;
    //   },
    // },
  });
  return Category;
};