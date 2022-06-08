const express = require('express')
const router = express.Router()
const {Comments} = require("../models"); //to create an instance of the database table posts needed here


//importing middlewares
const {ValidateToken} = require('../middleswares/Authmiddleware');



//to get all the comments for a particular post using get request.
router.get("/:postId", async (req, res) => {
    const reqpostId = req.params.postId;
    const comments = await Comments.findAll({where: {PostId: reqpostId}}); //fetch all the comments from the database correlating with the post Id 
    res.json(comments);
})



router.post("/",  ValidateToken, async (req, res) => { //ValidateToken is a middleware that runs first before making comment to check if the user has been logged in and has a valid
    const comment = req.body;
    const username = req.user.username //req.user is gotten from the middleware Validatetoken (req.user is an object containing the logged in user username and id)
    comment.username = username //to add a property username to the comment object and assign the value of the username. then send to data base
    console.log(comment);
    await Comments.create(comment); //collecting the cppment data from the post request and saving it into the post table //its async function it take time to complete
    res.json(resp = {
        stat : res.statusCode,
        username : comment.username
    });
});


//to delete a comment by the user that comment
router.delete("/:commentId", ValidateToken, async (req, res) => {
    const commentId = req.params.commentId;

    // the sequelize function thatdelete is destroy (i.e delete the row where the comment id is equal the comment id in the database table)
    Comments.destroy({where: {id: commentId}});

    res.json("delete successfully")

});













module.exports = router