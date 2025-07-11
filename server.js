import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); 
import {connectDB} from './config/db.js'; 
import Product from './models/product.model.js';
import mongoose from 'mongoose';


//import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { mongo } from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Load .env from backend folder
dotenv.config({ path: path.resolve(__dirname, './.env') });




   
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

app.get("/api/products", async (req, res) => {
    try {   
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);  
        res.status(500).json({ message: 'Error fetching products' });
    }   
    
});






app.post("/api/products", async (req, res) => {
    const product=req.body;
    if (!product.name || !product.price || !product.image  ) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const newProduct = new Product(product);
    
    try {
        await newProduct.save();
    
        res.status(201).json({ message: 'Product saved successfully', product: newProduct });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ message: 'Error saving product' });  
    }
    
});


app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params; 
    const product=req.body;
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }
    try {
        const updatedProduct= await Product.findByIdAndUpdate(id, product, { new: true });
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    
    }
});




app.delete("/api/products/:id", async (req, res) => {
    const{ id } = req.params;
    try{
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product deleted successfully' });  
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product' });  
    }

});





console.log(process.env.MONGO_URI);

app.listen(5000,() => {
    connectDB();
    console.log('Server is running at http://localhost:5000');          
});    