const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
//connect to database
mongoose.connect('mongodb://localhost:27017/product-manage-systems')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));;

//product-model
const Product = mongoose.model('Product', {
    productCode: String,
    productName: String,
    productDate: { type: Date, default: Date.now },
    productOriginPrice: Number,
    quantity: Number,
    productStoreCode: String
});

// REST API endpoints
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(404).json({ message: 'Product not found' });
    }
});
app.get('/', async (req, res) => {
    try {
        const products = await Product.find().sort({ productStoreCode: -1 });
        res.render('index', { products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.set('view engine', 'ejs');
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});