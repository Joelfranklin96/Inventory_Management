import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

export default class UserController{
    getRegister(req, res){
        res.render('register', {userEmail: req.session.userEmail});
    }

    getLogin(req, res){
        res.render('login', {errorMessage: null, userEmail: req.session.userEmail});
    }

    postRegister(req, res){
        const{name, email, password} = req.body;
        UserModel.add(name, email, password);
        res.render('login', {errorMessage: null, userEmail: req.session.userEmail});
    }

    postLogin(req, res){
        const{email, password} = req.body;
        const user = UserModel.isValidUser(email, password);
        if(!user){
            return res.render('login',{errorMessage: "Invalid credentials", userEmail: req.session.userEmail})
        }
        req.session.userEmail = email;
        let products = ProductModel.get();
        return res.render('products', {products:products, userEmail: req.session.userEmail});
    }

    logout(req, res){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }
            else{
                res.redirect('/login')
                // When we redirect to '/login', we are calling the getLogin controller function and not postLogin controller function 
                // because redirecting arises a get request and not a post request.
            }
        });
        // cookies are deleted using the below command
        // res.clearCookie('lastVisit');
    }
}

// res.locals: Cleared at the end of each request/response cycle. Do not need to be explicity passed to controller functions for rendering the views.
// req.session: Maintains state across multiple requests but must be explicitly passed to controller functions for rendering the views unless copied to res.locals.
// req.cookies: Persisted on the client's browser and sent with every request, based on cookie settings like domain, path, and expiration.

// req.cookies is for reading cookies that have been sent from the client to the server.
// res.cookie() is for sending cookies from the server back to the client.