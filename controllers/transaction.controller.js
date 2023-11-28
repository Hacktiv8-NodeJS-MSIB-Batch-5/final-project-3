const { moneyFormat } = require("../helpers/utils");
const { User, Product, Category, TransactionHistory, sequelize } = require("../models");

exports.postTransaction = async (req, res) => {
  const productId = req.body.productId;
  const quantity = Number(req.body.quantity);
  const userId = req.user_id;

  if (quantity <= 0){
    return res.status(500).json({ message: "Amount bought must be more than 1" });
  }
  try{
    const product = await Product.findByPk(productId);
    if (!product){
      return res.status(500).json({ message: "Product not found" });
    }

    const productdata = product.dataValues;
    const stock = productdata.stock;
    const totalprice = productdata.price * quantity;

    if (stock < quantity){
      return res.status(400).json({ message: "Not enough stock" })
    }

    let user = await User.findByPk(userId);
    const userBalance = user.dataValues.balance;

    if (userBalance < totalprice){
      return res.status(400).json({ message: "Not enough balance, please top up" });
    }

    try{
      const result = await sequelize.transaction( async(t) => {
        await product.update({
          stock: stock - quantity
        }, {transaction: t});

        const balance = userBalance - totalprice;
        await user.update({
          balance
        }, {transaction: t});

        const category = await Category.findByPk(productdata.CategoryId);
        const sold_product_amount = category.sold_product_amount + quantity;
        // console.log("ini", quantity);
        // console.log("ini", category.sold_product_amount, typeof(category.sold_product_amount));
        // console.log("ini", sold_product_amount);
        await category.update({
          sold_product_amount
        }, {transaction: t});

        await TransactionHistory.create({
          ProductId: productdata.id,
          UserId: user.id,
          quantity: quantity,
          total_price: totalprice,
        }, {transaction: t});

        res.status(201).send({
          message: "You have successfully purchase the product",
          transactionBill: {
            total_price: moneyFormat(totalprice),
            quantity: quantity,
            product_name: productdata.title,
          }
        });
      })
      
    }
    catch(e){
      // console.log(e);
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
  } catch (e){
    res.status(500).json({message: "An error occured while attempting to POST new Transaction History"})
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
      attributes: ['ProductId', 'UserId','quantity', 'total_price', 'createdAt', 'updatedAt'],
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
      attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
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
  const userId = req.user_id;

  try {
    const transaction = await TransactionHistory.findByPk(transactionId, {
      include: [
        { model: Product, as: "Products", attributes: ['id','title','price','stock','CategoryId'] }
      ],
      attributes: ['ProductId', 'UserId', 'quantity', 'total_price', 'createdAt', 'updatedAt'],
    });
    if (!transaction){
      return res.status(404).json({ message: "Transaction not found" });
      //di atas spy kalau enggak ada, nggak error saat panggil transaction.UserId di bawah
    }
    
    const user = await User.findByPk(userId); 
    if(user.dataValues.role != "admin" && userId !== transaction.UserId){
      // console.log(userId);
      // console.log(transaction.UserId);
      return res.status(401).json({
        message: "You are not authorized to do this action"
      })
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while attempting to fetch the transaction",
      name: error.name,
      message: error.message,
    });
  }
}