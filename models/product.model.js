const mongoose = require("mongoose")

const productsSchema = mongoose.Schema({
  name:{type:String, required:true},
  price:{type:Number, required:true},
  category:{type:String, required:true},
})
const productModel = mongoose.model("products", productsSchema)


module.exports = productModel