//for all the routes related to posts. (i.e localhost/post or localhost/post/.....)

// ****all the function written when using sequelize must be async

const express = require('express')
const router = express.Router()
const {Likes} = require("../models"); //to create an instance of the database table Likes needed here
const {ValidateToken} = require('../middleswares/Authmiddleware')






router.post("/", ValidateToken, async (req, res) => {
    const {PostId} = req.body;
    console.log(PostId)
    const UserId = req.user.id; //gotten from the vlidatetoken middleware

    //checking
    const found = await Likes.findOne({where: {UserId:UserId, PostId:PostId}}); //to check if the user already the this particluar before 

    if(!found){  //if the user has not like, let them like
        await Likes.create({PostId: PostId, UserId: UserId});
        res.json({liked: true}) //to provide some authentication in frontend, to know whether its liked 

    }else{ //if the have liked before, let them unlike
        await Likes.destroy({where: {UserId:UserId, PostId:PostId}});
        res.json({liked:false}) //to provide some authentication in frontend, to know tts unliked 
    }

})








module.exports = router