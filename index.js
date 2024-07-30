const express = require("express")
const app = express()
const cors = require("cors")
const morgan = require("morgan")
const { userRouter } = require("./routes/user.route")
const { connection } = require("./db")
const { productRouter } = require("./routes/product.route")
require("dotenv").config()


app.use(morgan('method :method URL :url status :status responseTime :response-time ms'));
app.use(cors())
app.use(express.json())

app.use("/user", userRouter)
app.use("/product", productRouter)



app.listen(process.env.PORT, async () => {
    try{
       await connection
        console.log("connected to database")
    }catch(err){
        console.log({error:err+"connection failed to database"})
    }
    console.log("server is running on port " + process.env.PORT)
})  