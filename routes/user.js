const router = require("express").Router();
const authentication = require("../middlewares/authentication").verify;
const controller = require("../controllers/user.controller");

router.post("/register", controller.register);
router.post("/login", controller.login);
router.put("/", authentication, controller.updateUser);
router.delete("/", authentication, controller.deleteUser);
router.patch("/topup", authentication, controller.userTopup);

module.exports = router;