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

//SUBMIT A SALE
router.post('/', async (req, res) => {

    const sale = new Sales({
        saleId: req.body.saleId,
        price: req.body.price,
        date: req.body.date,
        type: req.body.type,
        properties: req.body.properties,
        multiple: req.body.multiple,
        coordinates: req.body.coordinates,
        text: req.body.text
    })

    try {
        const savedSale = await sale.save()
        res.json(savedSale)
    } catch (err) {
        res.json({ message: err })
    }
});

//SPESIFIC POST
router.get('/:salesId', async (req, res) => {

    try {
        const sale = await Sales.findById(req.params.salesId);
        res.json(sale);
    } catch (err) {
        res.json({message: err});
    }
})

//Update a post
router.patch('/:salesId', async (req,res) => {
    try {
        const updatedSale = await Sales.updateOne(
            {_id: req.params.salesId}, 
            {$set : {price: req.body.price}
        });
        
        res.json(updatedSale);
    }catch(err) {
        res.json({message: err})
    }
})

//DELETE POST
router.delete('/:salesId', async (req,res) => {
    try {
        const removedSale = await Sales.remove({_id: req.params.salesId})
        res.json(removedSale);
    }catch(err) {
        res.json({message: err})
    }
})

module.exports = router;