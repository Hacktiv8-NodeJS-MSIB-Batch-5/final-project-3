const router = require("express").Router();
const authorization = require("../middlewares/authorization").isAdmin;
const controller = require("../controllers/transaction.controller");

router.post("/", controller.postTransaction);
router.get("/user", controller.getUserTransactions)
router.get("/admin", authorization, controller.getAllTransactions)
router.get("/:transactionId", controller.getTransactionById)

module.exports = router;