//for all the routes related to posts. (i.e localhost/post or localhost/post/.....)

// ****all the function written when using sequelize must be async

const express = require('express')
const router = express.Router()
const { Posts, Likes } = require("../models"); //to create an instance of the database table posts needed here
const { ValidateToken } = require("../middleswares/Authmiddleware");








//to get all the post and snd to frontend
router.get("/", ValidateToken, async (req, res) => {
    //to get all the posts from the database post table
    //to be able to display the number of like for each post we join the likes table to the post table and fetch the two out using the include 
    // the Like is going to be an array in the object post (an array inside an object)
    const postList = await Posts.findAll({ include: [Likes] });

    //to be able to get all the post that the logged in in user as already liked (and be able to differentiate from the ones not yet liked in frontend)
    const likedPost = await Likes.findAll({ where: { UserId: req.user.id } })

    //sending the two to the frontend, we send them as an object
    res.json({ postList: postList, likedPost: likedPost })
})

router.get("/notlogged", async (req, res) => {
    //to get all the posts from the database post table
    //to be able to display the number of like for each post we join the likes table to the post table and fetch the two out using the include 
    const postList = await Posts.findAll({ include: [Likes] });
    res.json(postList)
})


//to get detail for a partcular post clicked using its id
router.get("/postId/:pId", async (req, res) => {
    const id = req.params.pId  //the id is sent with the request from frontend and is collect with the params here.
    const post = await Posts.findByPk(id)   //fetching the post with the id from the database pk= primary key (findbyprimarykey)
    res.json(post);
})


// to register a post to the data base
router.post("/", ValidateToken, async (req, res) => {
    const post = req.body;
    console.log(post)
    await Posts.create(post); //collecting the post data from the post request and saving it into the post table //its async function it take time to complete
    res.json(res.statusCode);
})


//to delete post by the person that makes the post
router.delete("/:postId", ValidateToken, async (req, res) => {
    const postId = req.params.postId;

    // the sequelize function thatdelete is destroy (i.e delete the row where the comment id is equal the comment id in the database table)
    await Posts.destroy({ where: { id: postId } });

    res.json("delete successfully")
})


//to get all the post the user has posted when checking their profile page
router.get("/profile/:username", ValidateToken, async (req, res) => {   

    const username = req.params.username;

    const posts = await Posts.findAll({where: {username: username}, include:[Likes]});
    res.json(posts);

})



//to edit or update sumtin in the database
//to edit/update the post title for a particular post in the database.
router.put("/title", ValidateToken, async (req, res) => {
    const  {newTitle, id} = req.body;
    await Posts.update({title: newTitle}, {where:{id: id}});  //to update the post title of the post where id = id then (change title = newTitle) in the database
    res.json(newTitle)
})


//to edit the post body in the database
router.put("/postbody", ValidateToken, async (req, res) => {
    const  {newpostBody, id} = req.body;
    await Posts.update({postBody: newpostBody}, {where:{id: id}});  //to update the post title of the post where id = id then (change title = newTitle) in the database
    res.json(newpostBody)
})





module.exports = router