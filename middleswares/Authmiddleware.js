//the auth middleware is to authenticate the JWT token of the user.... using the verify function from jsonwebtoken

const {verify} = require('jsonwebtoken');


const ValidateToken = (req, res, next) => {
    const accToken = req.header("accessToken") //the accessToken pass to the req.header is sent from frontend.
    console.log(accToken)

    if(!accToken) return res.json({error: "User not logged in"}) //i.e if the user has no JWT  when making the request

    try{
        const validToken = verify(accToken, "secret"); //to verify if the JWT is valid, secret is the string used when creating the JWT

        if(validToken){

            req.user = validToken // the req.user is a variable you collect all the details of the token which is in validToken (validToken is an object) to have access to it 
                                    // the req.user is always available when using the ValidateToken middledware in an endpoint
            return next(); //if its valid then carry on with the next function
        }
    }catch(err){
        return res.json({error:err}) //if not valid return error
    }
}


module.exports = {ValidateToken};