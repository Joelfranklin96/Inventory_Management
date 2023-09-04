import {body, validationResult} from 'express-validator';

const validateRequest = async function(req, res, next){

    // 1. Define the rules
    const rules = [
        body('name').notEmpty().withMessage("Name is required"),
        body('price').isFloat({gt:0}).withMessage("Price should be a positive value"),
        //body('imageUrl').isURL().withMessage("Invalid Url")
        body('imageUrl').custom(function(value, {req}){ //The express-validator allows us to define our own 'custom' functions
            if(!req.file){
                throw new Error('Image is required');
            }
            return true;
        })
    ];

    // 2. Run the rules
    await Promise.all(rules.map(function(rule){return rule.run(req)}));

    // 3. Check if there are any errors after running the rules
    var validationErrors = validationResult(req);

    // 4. If errors, return the error message
    if (!validationErrors.isEmpty()){
        return res.render("new-product", {errorMessage: validationErrors.array()[0].msg});
    }
    console.log(validationErrors);
    next();
}

export default validateRequest;