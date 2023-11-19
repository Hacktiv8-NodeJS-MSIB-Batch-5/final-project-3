const router = require("express").Router();
const auth = require("../middlewares/authentication").verify;
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login", auth, controller.login);

module.exports = router;