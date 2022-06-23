const Product = require("../models/product.model")

function getCart(req,res){
    res.render("customer/cart/cart");
}

async function addCartItem(req,res,next){
    let product; 
    try{
        product = await Product.findProductById(req.body.productId)
    } catch(error){
        next(error);
        return;
    }

    const cart = res.locals.cart;

    cart.addItem(product);
    req.session.cart = cart;
    res.status(201).json({message: "Cart Updated", newTotalItems: cart.totalQuantity});
}

module.exports = {
    getCart: getCart,
    addCartItem: addCartItem,
}