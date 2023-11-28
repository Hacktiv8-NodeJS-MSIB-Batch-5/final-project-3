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

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll({})
    if(products.length == 0){
      return res.status(404).json({
        message: "There is no products"
      })
    }
    res.status(200).json({
      products: products
    })
  } catch (error) {
    
  }
}

exports.putProduct = async (req, res) => {
  const productId = req.params.productId;
  const { title, price, stock } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.update({
      title,
      price,
      stock,
    });

    res.status(200).json({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.patchProduct = async (req, res) => { //fucntion to change only the categoryId
  const productId = req.params.productId;
  const { CategoryId } = req.body;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const category = await Category.findByPk(CategoryId);

    if (!category) {
      return res.status(404).json({
        message: "CategoryId Not Found",
      });
    }

    await product.update({
      CategoryId,
    });

    res.status(200).json({
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteProduct = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.destroy();

    res.status(200).json({
      message: "Product has been successfully deleted"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}