const express = require("express")
require("dotenv").config()
const { connection } = require("./db")
const { userRoute } = require("./routes/User.route")
const { productRoute } = require("./routes/product.route")
const app = express()
app.use(express.json())



app.use("/user", userRoute)
app.use('/product', productRoute)

app.listen(8080, async()=>{
    try{
        await connection
        console.log("connected to db")
    }catch(err){
        console.log(err)
    }
    console.log(`server is running on port 8080`)
})
