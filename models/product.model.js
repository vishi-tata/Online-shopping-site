const mongodb = require("mongodb");

const db = require("../data/database");

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image;
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString();
    }
    this.remoteUrl = productData.remoteUrl;
  }

  static async findAll() {
    let products = await db.getDb().collection("products").find().toArray();
    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
      remoteUrl: this.remoteUrl
    }

    if(this.id){
      const prodId = new mongodb.ObjectId(this.id);

      if(!this.image){
        delete productData.image;
      }
      await db.getDb().collection("products").updateOne({_id:prodId},
        {$set:productData})
    } else{
      await db.getDb().collection("products").insertOne(productData);
    }
  }

  static async findProductById(id) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(id);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db.getDb().collection("products").findOne({ _id: prodId });
    if (!product) {
      const error = new Error("Could not find product with the provided id");
      error.code = 404;
      throw error;
    }

    return new Product(product);
  }

  replaceImage(newImage){
    this.image = newImage;
    this.updateImageData()
  }

  updateImageData(){
    this.imagePath = `product-data/images/${this.image}`;
  }

  updateRemoteUrl(remoteUrl){
    this.remoteUrl = remoteUrl;
  }

  remove(){
    const prodId = new mongodb.ObjectId(this.id);
    return db.getDb().collection("products").deleteOne({_id: prodId})
  }
}

module.exports = Product;
