const express = require("express")
const { Product } = require("../models/product.model")
const productRoute = express.Router()
const {authenticateToken} = require("../Middleware/auth")
const {authorizeRoles} = require("../Middleware/authorize")


productRoute.get("/",authenticateToken, authorizeRoles(['admin', "user"]), async (req, res) => {
    try {
        const products = await Product.find()
        if (!products) {
            return res.status(404).json({ message: "Products not found", status: 404 })
        }
        res.status(200).json(products)
    } catch (err) {
        res.status(500).json({ 'err': err.message })
    }
})



productRoute.get("/:id", authenticateToken, authorizeRoles(['admin', "user"]),async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById({ _id: id })
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: 404 })
        }
        res.status(200).json(product)
    } catch (err) {
        res.status(500).json({ 'err': err.message })
    }
})


productRoute.post("/",authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const { name, price, category } = req.body;
        const newProduct = new Product({ name, price, category });
        const savedProduct = await newProduct.save();
        res.status(201).send({ product: savedProduct, status: 201 });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
})


productRoute.patch("/:id",authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const { id } = req.params
        const { name, price, category } = req.body  
        const product = await Product.findByIdAndUpdate({ _id: id }, { name, price, category })
        if (!product) {     
            return res.status(404).json({ message: "Product not found", status: 404 })
        }
        res.status(200).json({ product, status: 200 })
    } catch (err) {
        res.status(500).json({ 'err': err.message })
    }
})


productRoute.delete("/:id",authenticateToken, authorizeRoles(['admin']), async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete({ _id: id })    
        if (!product) {
            return res.status(404).json({ message: "Product not found", status: 404 })
        }
        res.status(200).json({ product, status: 200 })
    } catch (err) {
        res.status(500).json({ 'err': err.message })
    }
})



module.exports = { productRoute }
