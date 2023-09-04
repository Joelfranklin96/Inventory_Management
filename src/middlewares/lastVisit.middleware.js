export const setLastVisit = function(req, res, next){

    // All the cookies stored on the browser (client) are sent through 'req.cookies'
    // We are able to access the lastVisit property of req.cookies because we have set it in the previous response. 
    // The cookies of previous response had the property 'lastVisit' and it was stored in the browser. 
    // So in the next request, we are able to access the cookies in the request.
    if (req.cookies.lastVisit){
        res.locals.lastVisit = new Date(req.cookies.lastVisit).toLocaleString();
    }
    res.cookie('lastVisit', new Date().toISOString(),{maxAge:2*24*60*60*1000});
    // The above line updates the lastVisit property of response to current time and sends the response to the client browser. 
    // Next time the client sends a request to the server, the same value is stored in req.cookies.lastVisit 
    next();
}

// Cookies have to be explicitly set in the response using res.cookie()
// Once set, the client's browser will send the cookie back with every subsequent request to that server, 
// as long as the cookie hasn't expired or been deleted.

// res.locals: Cleared at the end of each request/response cycle. Do not need to be explicity passed to controller functions for rendering the views.
// req.session: Maintains state across multiple requests but must be explicitly passed to controller functions for rendering the views unless copied to res.locals.
// req.cookies: Persisted on the client's browser and sent with every request, based on cookie settings like domain, path, and expiration.

// req.cookies is for reading cookies that have been sent from the client to the server.
// res.cookie() is for sending cookies from the server back to the client.

// Cookies are stored on the client and sessions are stored on the server.
