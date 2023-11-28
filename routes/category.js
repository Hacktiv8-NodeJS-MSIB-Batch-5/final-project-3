const router = require("express").Router();
const controller = require("../controllers/category.controller");

router.post("/", controller.postCategory);
router.get("/", controller.getAllCategories)
router.patch("/:categoryId", controller.patchCategory)
router.delete("/:categoryId", controller.deleteCategory)

module.exports = router;