const { User } = require("../models");

const isAdmin = async(req, res, next) => {
  const headerUserId = req.user_id;
  const user = await User.findByPk(headerUserId);
  if (user.role == "customer") {
    return res.status(401).json({
      message: "You are not authorized to view this content. Please log in as admin.",
    });
  }
  next();
}

module.exports = {
  isAdmin,
}