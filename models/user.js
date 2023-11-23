'use strict';

const { hashPassword } = require("../helpers/bcrypt");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "full_name is required"
        },
        notNull: {
          args: true,
          msg: "full_name is required"
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: "email must be a valid email"
        },
        notEmpty: {
          args: true,
          msg: "email is required"
        },
        notNull: {
          args: true,
          msg: "email is required"
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        customValidator(pw) {
          console.log("pw", pw);
          if (pw.length < 6 || pw.length > 10) {
            throw new Error("password length must be between 6 to 10 characters");
          }
        },
        notEmpty: {
          args: true,
          msg: "password is required"
        },
        notNull: {
          args: true,
          msg: "password is required"
        },
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["male", "female"]],
          msg: "Must be male or female"
        },
        notEmpty: {
          args: true,
          msg: "gender is required"
        },
        notNull: {
          args: true,
          msg: "gender is required"
        },
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "customer"]],
          msg: "Must be admin or customer"
        },
        notEmpty: {
          args: true,
          msg: "role is required"
        },
        notNull: {
          args: true,
          msg: "role is required"
        },
      }
    },
    balance: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          args: true,
          msg: "balance must be an integer/number"
        },
        min: {
          args: [0],
          msg: "balance must not be less than 0"
        },
        max: {
          args: 100000000,
          msg: "balance must not be more than 100000000"
        },
        notEmpty: {
          args: true,
          msg: "balance is required"
        },
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
       beforeCreate: (user, param) => {
        const hashedPassword = hashPassword(user.password);
        user.password = hashedPassword;
        user.balance = 0;
      },
    },
  });
  return User;
};