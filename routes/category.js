const router = require("express").Router();
const controller = require("../controllers/category.controller");

router.post("/", controller.postCategory);

module.exports = router;