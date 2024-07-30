const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    role:{type:String, required:true, enum:["admin", "user"], default:"user"},
})

const User = mongoose.model("User", userSchema)

module.exports = {User}