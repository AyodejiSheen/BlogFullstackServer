const express = require('express')
const app = express();  //an instance of express.
const cors = require('cors'); //to allow access from the frontend
require("dotenv").config(); // to switch to web hosting port or localhost port



//to be able to read json format from post request
app.use(express.json());

let corsOptions = {
    origin:['http://localhost:3000'],
    optionSuccessStatus:200
}

app.use(cors(corsOptions)); //to allow access from the frontend



//importing the database models
const db = require('./models')



//importing the routers
const postRouters = require('./Routes/posts')
const commentRouters = require('./Routes/comments')
const usersRouters = require('./Routes/users')
const likesRouters = require('./Routes/likes')













//creating the  routers middleware
app.use("/posts", postRouters);   //for post related routes
app.use("/comments", commentRouters) //for comment related routes
app.use("/auth", usersRouters) //for users related route
app.use("/likes", likesRouters) //for like related routes



//to connect to database when app starts
db.sequelize.sync().then(() => {

    //to start listening to request at a port
    app.listen(process.env.PORT || 3001, () => {
    console.log("the server in running")
    })

})
.catch((err) => {
    console.log(err);
})

