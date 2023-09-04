import express from 'express';
import ejsLayouts from 'express-ejs-layouts';
import ProductController from "./src/controllers/product.controller.js";
import UserController from './src/controllers/user.controller.js';
import path from 'path';
import validateRequest from './src/middlewares/validation.middleware.js';
import {uploadFile} from './src/middlewares/file-upload.middleware.js';
import session from 'express-session';
import { auth } from './src/middlewares/auth.middleware.js';
import cookieParser from 'cookie-parser';
import {setLastVisit} from './src/middlewares/lastVisit.middleware.js';

const server = express();

server.use(express.urlencoded({extended: true})); // The middle ware will take the urlencodded data, parse the data and put it inside the 'body'.
server.use(express.json());

server.use(session({ // Session is a middleware and we are configuring our session
    secret: "SecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false} // We set it to false for http protocol and true for https protocol
})); // 'session' is a middleware and we are configuring our session

// By using server.use(session(...));, you're telling Express to use this session middleware for every incoming HTTP request. 
// This middleware will attach a session object to the req (request) object, making it available as req.session in every 
// route handler that you define afterwards.

// First we are setting the lastVisit property (cookies) in the response object sent from server to client. The next time, the same cookies
// are parsed into the request object and sent from client to server. This job is done by the below line server.use(cookieParser)
server.use(cookieParser());
// If you register setLastVisit as a middleware using server.use(setLastVisit);, then this middleware will be executed for every 
// incoming request to the server before reaching any subsequent route handlers or other middleware. 
// This is because server.use() without a specific route applies the middleware globally to all routes.
server.use(setLastVisit);

// Once a cookie has been set in a response using res.cookie(), the browser will store it and automatically include it in the 
// headers of every subsequent request to the same domain, until the cookie expires or is deleted.
// So if you set a cookie while handling a request for the '/' route on example.com, that cookie will be sent by the browser in 
// all subsequent requests to example.com, regardless of the specific route (e.g., example.com/guess, example.com/login, etc.).

// We are setting the view engine as ejs
server.set("view engine", "ejs");
server.set("views", path.join(path.resolve(), 'src', 'views')); // This is where the ejs template engine will look for files to render

server.use(ejsLayouts); // Uses the layout.ejs as layout for all pages

const productController = new ProductController();
const userController = new UserController();
server.get('/', auth, productController.getProducts);
server.get('/register', userController.getRegister);
server.get('/login', userController.getLogin);
server.post('/register', userController.postRegister);
server.post('/login', userController.postLogin);
server.get('/new', auth, productController.getAddForm);
server.get('/update/:id', auth, productController.getUpdateProductView);
server.post('/delete/:id', productController.deleteProduct);
// Note - When we 'go' to any particular URL, a default 'GET' request is sent by the browser to the server.
// It is not any kind of request but a default 'GET' request.
server.post('/', auth, uploadFile.single('imageUrl'), validateRequest, productController.addNewProduct);
// we specify uploadFile.single(imageUrl) because the image is found inside the 'imageUrl' field of the form request
// The uploadFile middleware attaches new values to the request such as req.file
server.post('/update', auth, uploadFile.single('imageUrl'), validateRequest, productController.postUpdateProduct);

//In this case, all static files you want to serve to the client would be placed in a folder called public. 
// Then you can access any file in that folder via a URL like http://localhost:[port]/filename.

server.get('/logout', userController.logout);

server.use(express.static('src/views'));
server.use(express.static('public'));
server.listen(3400, function(){
    console.log("Server is listening at port 3400");
});