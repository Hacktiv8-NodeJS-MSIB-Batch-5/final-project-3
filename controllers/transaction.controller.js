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

          const balance = userBalance - totalprice;
          await User.update({
            balance
          }, {
            where: { id: userId }
          });

          const category = await Category.findByPk(productdata.CategoryId);
          const sold_product_amount = category.sold_product_amount + quantity;
          console.log("ini", quantity);
          console.log("ini", category.sold_product_amount);
          console.log("ini", sold_product_amount);
          await Category.update({
            sold_product_amount: 1
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

exports.getUserTransactions = async(req, res) => { //based on user id
  const userId = req.user_id;

  try {
    const userTransactions = await TransactionHistory.findAll({
      where: { UserId: userId },
      include: [{ 
        model: Product, 
        as: "Products",
        attributes: ['id','title','price','stock','CategoryId']
      }],
      attributes: ['id', 'quantity', 'total_price', 'createdAt'],
    });

    res.status(200).json({ transactionHistories: userTransactions });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while attempting to fetch user transactions",
      name: error.name,
      message: error.message,
    });
  }
}

exports.getAllTransactions = async(req, res) => {
  try {
    const allTransactions = await TransactionHistory.findAll({
      include: [
        { model: Product, as: "Products", attributes: ['id','title','price','stock','CategoryId'] },
        { model: User, as: "User", attributes: ['id','email','balance','gender','role'] },
      ],
      attributes: ['id', 'quantity', 'total_price', 'createdAt'],
    });

    res.status(200).json({ transactionHistories: allTransactions });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while attempting to fetch all transactions",
      name: error.name,
      message: error.message,
    });
  }
}

exports.getTransactionById = async(req, res) => { //based on transaction id
  const transactionId = req.params.transactionId;
  const userId = req.user_id

  try {
    const transaction = await TransactionHistory.findByPk(transactionId, {
      include: [
        { model: Product, as: "Products", attributes: ['id','title','price','stock','CategoryId'] }
        // { model: User, as: "User", attributes: ['id','email','balance','gender','role'] },
      ],
      attributes: ['id', 'ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
    });
    
    if(userId != 1 && userId !== transaction.UserId){
      console.log(userId);
      console.log(transaction.UserId);
      return res.status(401).json({
        message: "You are not authorized to do this action"
      })
    }

    if (transaction) {
      res.status(200).json({ transaction });
    } else {
      res.status(404).json({ message: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while attempting to fetch the transaction",
      name: error.name,
      message: error.message,
    });
  }
}