import path from 'path';
import ProductModel from '../models/product.model.js';

export default class ProductController{
    getProducts(req, res){
        let products = ProductModel.get();
        res.render("products", {products: products, userEmail: req.session.userEmail});
        //return res.sendFile(path.join(path.resolve(),"src","views","products.html"));
    }

    getAddForm(req, res){
        return res.render('new-product',{errorMessage: null, userEmail: req.session.userEmail});
    }

    addNewProduct(req, res){
        const {name, desc, price} = req.body;
        const imageUrl = "images/" + req.file.filename; // The uploadFile middle has appended the 'file' property to the 'req'
        ProductModel.add(name, desc, price, imageUrl);
        let products = ProductModel.get();
        return res.render("products", {products: products, userEmail: req.session.userEmail});
    }

    getUpdateProductView(req, res, next){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if (productFound){
            res.render('update-product',{product: productFound, errorMessage:null, userEmail: req.session.userEmail});
        }
        else{
            res.status(401).send('Product not found');
        }
    }

    postUpdateProduct(req, res){
        const {id, name, desc, price} = req.body
        const imageUrl = "images/" + req.file.filename;
        ProductModel.update(id, name, desc, price, imageUrl);
        let products = ProductModel.get();
        return res.render("products", {products: products, userEmail: req.session.userEmail});
    }

    deleteProduct(req, res){
        const id = req.params.id;
        const productFound = ProductModel.getById(id);
        if (!productFound){
            res.status(401).send('Product not found'); 
        }
        ProductModel.delete(id);
        const products = ProductModel.get();
        res.render("products", {products: products, userEmail: req.session.userEmail});
    }
}

// Note - locals refers to the local variables that are passed to the template during rendering. 
// When you use res.render() to render a view in Express.js, you can pass an object containing variables that you want to make 
// available to the view. These variables become "locals" for that specific rendering operation.