const router = require("express").Router();
const authorization = require("../middlewares/authorization").isAdmin;
const controller = require("../controllers/product.controller");

router.post("/", authorization, controller.postProduct);
router.get("/", controller.getAllProduct)
router.put("/:productId", authorization, controller.putProduct)
router.patch("/:productId", authorization, controller.patchProduct)
router.delete("/:productId", authorization, controller.deleteProduct)

module.exports = router;