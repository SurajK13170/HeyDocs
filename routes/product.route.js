const express = require('express');
const productRouter = express.Router();
const { ProductsModel } = require('../models/product.model');
const {authenticateToken} = require('../middel_Ware/auth')
const {authorizeRoles} = require("../middel_Ware/authorization")

productRouter.get('/',authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const products = await ProductsModel.find();
        res.status(200).json({products, status: 200});
    } catch (error) {
        res.status(500).json({error, status: 500});
    }
});


module.exports = {productRouter};
