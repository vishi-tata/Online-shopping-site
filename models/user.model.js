const bcrypt = require("bcryptjs");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(email, password, fullName, street, pinCode, city) {
    this.email = email;
    this.password = password;
    this.name = fullName;
    this.address = {
      street: street,
      pinCode: pinCode,
      city: city,
    };
  }

  async signUp() {
    const hashedPassword = await bcrypt.hash(this.password, 12);
    await db.getDb().collection("users").insertOne({
      email: this.email,
      password: hashedPassword,
      name: this.name,
      address: this.address,
    });
  }

  getUserWithSameEmail(){
    return db.getDb().collection("users").findOne({email: this.email});
  }

  static findUserById(userId){
    const uid = new mongodb.ObjectId(userId);
    return db.getDb().collection("users").findOne({_id: uid},{projection:{password: 0}});
  }

  async existsAlready(){
    const existingUser = await this.getUserWithSameEmail();
    if(existingUser){
      return true;
    }
    return false;
  }

  hasMatchingPassword(hashedPassword){
    return bcrypt.compare(this.password,hashedPassword);
  }
}

module.exports = User;
