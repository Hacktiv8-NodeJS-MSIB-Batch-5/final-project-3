const { moneyFormat } = require("../helpers/utils");
const { User, Product, Category, TransactionHistory } = require("../models");

exports.postTransaction = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user_id;

  const product = await Product.findByPk(productId);
  if (product){
    const productdata = product.dataValues;
    const stock = productdata.stock;
    const totalprice = productdata.price * quantity;
    if (stock >= quantity){
      let user = await User.findByPk(userId);
      user = user.dataValues;
      const userBalance = user.balance;
      if (userBalance >= totalprice){
        try{
          await Product.update({
            stock: stock - quantity
          }, {
            where: { id: productdata.id }
          });

          const { balance } = userBalance - totalprice;
          await User.update({
            balance
          }, {
            where: { id: userId }
          });

          const category = Category.findByPk(productdata.CategoryId);
          const { sold_product_amount } = category.sold_product_amount + quantity;
          await Category.update({
            sold_product_amount
          }, {
            where: { id: productdata.CategoryId }
          });

          await TransactionHistory.create({
            ProductId: productdata.id,
            UserId: user.id,
            quantity: quantity,
            total_price: totalprice,
          });

          res.status(201).send({
            message: "You have successfully purchase the product",
            transactionBill: {
              total_price: moneyFormat(totalprice),
              quantity: quantity,
              product_name: productdata.title,
            }
          });
        }
        catch(e){
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
            error: "An error occured while attempting to POST new Transaction History", 
            name: e.name,
            message: ret || e.message
          });
        }
      }
      else{
        res.status(400).json({ message: "Not enough balance, please top up" });
      }
    }
    else{
      res.status(400).json({ message: "Not enough stock" })
    }
  }
  else{
    res.status(500).json({ message: "Product not found" });
  }
}