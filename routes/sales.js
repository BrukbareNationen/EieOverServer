const express = require('express');
const router = express.Router();
const Sales = require('../models/Sales');


//GET BACK ALL THE SALES
router.get('/', async (req, res) => {
    try {
        const sales = await Sales.find();
        res.json(sales)
    } catch (err) {
        res.json({ message: err })
    }
});

module.exports = router;