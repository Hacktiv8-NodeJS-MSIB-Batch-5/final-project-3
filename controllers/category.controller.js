const { Category } = require("../models");

exports.postCategory = async(req, res) => {
  const { type } = req.body;

  await Category.create({
    type,
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