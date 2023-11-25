const router = require("express").Router();
const controller = require("../controllers/transaction.controller");

router.post("/", controller.postTransaction);

module.exports = router;