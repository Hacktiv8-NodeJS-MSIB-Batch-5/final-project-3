const router = require("express").Router();
const authentication = require("../middlewares/authentication").verify;
const authorization = require("../middlewares/authorization").isAdmin;
const userRoutes = require("../routes/user");
const categoryRoutes = require("../routes/category");
const productRoutes = require("../routes/product"); 
const transactionRoutes = require("../routes/transaction");

router.use("/users", userRoutes);
router.use("/categories", authentication, authorization, categoryRoutes);
router.use("/products", authentication, productRoutes); //then, all productroutes except GET PRODUCT will use authorization
router.use("/transactions", authentication, transactionRoutes);

module.exports = router;