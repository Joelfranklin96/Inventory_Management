export const auth = function(req, res, next){
    if(req.session.userEmail){
        next();
    }
    else{
        res.redirect('/login');
    }
};