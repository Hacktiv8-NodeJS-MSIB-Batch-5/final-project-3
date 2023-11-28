const { Category, Product } = require("../models");

exports.postCategory = async(req, res) => {
  const { type } = req.body;
  // const defaultAmount = 0

  await Category.create({
    type, sold_product_amount: 0
  })
    .then((category) => {
      res.status(201).json({
        category: {
          id: category.id,
          type: category.type,
          updatedAt: category.updatedAt,
          createdAt: category.createdAt,
          sold_product_amount: category.sold_product_amount,
        },
      });
    })
    .catch((e) => {
      const ret = [];
      try{
        // log all errors on sequelize schema constraint & validation
        e.errors.map( er => {
          ret.push({
            [er.path]: er.message,
          });
        });
      } catch(e) {}
      res.status(500).json({
        error: "An error occured while attempting to POST category", 
        name: e.name,
        message: ret || e.message
      });
    })
}

exports.getAllCategories = async(req, res) => {
  try {
    const category = await Category.findAll({
      include: [{ 
        model: Product, 
        as: "Products",
        attributes: ['id','title','price','stock','CategoryId'] }]
    })
    if(category.length == 0){
      return res.status(404).json({
        message: "There is no Category"
      })
    }
    res.status(200).json({
      categories: category
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.patchCategory = async(req, res) => {
  const categoryId = req.params.categoryId;
  const { type } = req.body;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.update({
      type: type,
    });

    res.status(200).json({
      category: {
        id: category.id,
        type: category.type,
        sold_product_amount: category.sold_product_amount,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteCategory = async(req, res) => {
  const categoryId = req.params.categoryId;

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    await category.destroy();

    res.status(200).json({
      message: "Category has been successfully deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}