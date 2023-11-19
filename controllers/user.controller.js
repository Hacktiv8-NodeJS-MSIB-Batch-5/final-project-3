const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../middlewares/authentication");
const moneyFormat = require("../helpers/utils").moneyFormat;

exports.register = async (req, res) => {
  const body = req.body;
  const fullName = body.full_name;
  const email = body.email;
  const password = body.password;
  const gender = body.gender;
  const role = "customer";
  const balance = 0;
  await User.create({
    full_name: fullName,
    email: email,
    password: password,
    gender: gender,
    role: role,
  })
    .then((user) => {
      const token = generateToken({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        gender: user.gender,
        role: user.role,
      });
      console.log("user", user);
      res.status(201).json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          gender: user.gender,
          balance: `${moneyFormat(user.balance)}`,
          createdAt: user.createdAt,
        },
      });
    })
    .catch((e) => {
      const ret = [];
      try{
        // log all errors on sequelize schema constraint & validation
        e.errors.map( er => {
          ret.push({
            [er.path]: er.message,
          });
        });
      } catch(e) {}
      res.status(500).json({error: "An error occured while attempting to register", name: e.name, message: ret || e.message});
    })
};

exports.login = async(req, res) => {
  res.status(200).send("login");
}