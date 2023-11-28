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
      res.status(500).json({
        error: "An error occured while attempting to register", 
        name: e.name,
        message: ret || e.message
      });
    })
};

exports.login = async(req, res) => {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  await User.findOne({
    where: {
      email,
    },
  })
    .then((user) => {
      if (!user){
        return res.status(400).json({
          message: `Cannot find user with email '${email}'`,
        });
      }
      if (!password){
        return res.status(401).json({message: "Password not provided!"});
      }
      if (comparePassword(password, user.password)){
        let payload = {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          gender: user.gender,
          role: user.role,
        };
        const token = generateToken(payload);
        res.status(200).json({token});
      }
      else{
        res.status(401).json({message: "Wrong password!"});
      }
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
      res.status(500).json({
        error: "An error occured while attempting to login",
        name: e.name,
        message: ret || e.message
      });
    })
}

exports.updateUser = async(req, res) => {
  const body = req.body;
  const full_name = body.full_name;
  const email = body.email;
  const userId = Number(req.user_id);

  await User.update({
    full_name: full_name,
    email: email,
  },{
    where: { id: userId },
    returning: true,
    plain: true,
  })
    .then((user) => {
      user = user[1].dataValues;
      res.status(200).json({
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
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
      res.status(500).json({
        error: "An error occured while attempting to update user data",
        name: e.name,
        message: ret
      });
    })
}

exports.deleteUser = async(req, res) => {
  const userId = Number(req.user_id);

  await User.destroy({
    where: {
      id: userId,
    },
  })
    .then((result) => {
      let message;
      if (result == 0){
        message = "Account not found";
      }
      else message = "Your Account has been successfully deleted";

      res.status(200).json({
        message
      });
    })
    .catch((e) => {
      res.status(500).json({
        error: "An error occured while attempting to delete user account",
        message: e.message,
      })
    })
}

exports.userTopup = async (req, res) => {
  const userId = Number(req.user_id);

  try{
    const user = await User.findByPk(userId);
    if(!user){
      return res.status(404).json({message: "User not found"})
    }

    const addedBalance = Number(req.body.balance);
    const updatedBalance = Number(user.balance) + addedBalance;

    await user.update({
      balance: updatedBalance,
    })
      .then((result) => {
        const balance = moneyFormat(user.balance);
        
        res.status(200).json({
          message: `Your balance has been successfully updated to ${balance}`
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
        res.status(500).json({
          error: "An error occured while attempting to top up",
          name: e.name,
          message: ret || e.message
        });
      })
  } catch (e){
    res.status(500).json({error: e});
  }
}