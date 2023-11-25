const router = require("express").Router();
const authorization = require("../middlewares/authorization").isAdmin;
const controller = require("../controllers/product.controller");

router.post("/", authorization, controller.postProduct);

module.exports = router;