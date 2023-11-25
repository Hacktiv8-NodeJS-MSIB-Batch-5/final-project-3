const { Product, Category } = require("../models");
const moneyFormat = require("../helpers/utils").moneyFormat;

exports.postProduct = async (req, res) => {
  const { title, price, stock, CategoryId } = req.body;

  const category = await Category.findByPk(CategoryId);
  if (category) {
    await Product.create({
      title,
      stock,
      price,
      CategoryId,
    })
      .then((product) => {
        res.status(201).json({
          product: {
            id: product.id,
            title: product.title,
            price: `${moneyFormat(product.price)}`,
            stock: product.stock,
            CategoryId: product.CategoryId,
            updatedAt: product.updatedAt,
            createdAt: product.createdAt,
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
          error: "An error occured while attempting to POST product", 
          name: e.name,
          message: ret || e.message
        });
      })
  }
  else {
    res.status(503).json({
      message: "CategoryId Not Found",
    });
  }
}