const cloudinaryUploadFunction = require("../middlewares/cloudinary");
const Order = require("../models/order.model");
const Product = require("../models/product.model");


async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  res.render("admin/products/new-product");
}

async function createNewProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename,
  });
  const remoteUrl = await cloudinaryUploadFunction(product.imagePath,product.image);
  product.updateRemoteUrl(remoteUrl)
  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/admin/products");
}

async function getUpdateProduct(req, res, next) {
  let product;
  try {
    product = await Product.findProductById(req.params.id);
    res.render("admin/products/update-product", { product: product });
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  const product = new Product({
    ...req.body,
    _id: req.params.id,
  })

  if (req.file) {
    product.replaceImage(req.file.filename);
    const remoteUrl = await cloudinaryUploadFunction(product.imagePath,product.image);
    product.updateRemoteUrl(remoteUrl)
  }

  try {
    await product.save()
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/admin/products");
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findProductById(req.params.id);
    await product.remove();
  } catch (error) {
    next(error);
    return;
  }

  res.json({ message: "Deleted Product!" });
}

async function getOrders(req, res, next) {
  let orders;
  try {
    orders = await Order.findAll();
    res.render("admin/orders/all-orders", { orders: orders });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;
  let order;
  try {
    order = await Order.findById(orderId);
    order.status = newStatus;
    await order.save();
    res.json({ message: "Order Updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
