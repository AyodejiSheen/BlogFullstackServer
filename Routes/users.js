//for all the routes related to users. (i.e localhost/post or localhost/post/.....)

// ****all the function written when using sequelize must be async

const express = require('express')
const router = express.Router()
const { Users } = require("../models"); //to create an instance of the database table users needed here
const bcrypt = require('bcryptjs') // a library to hash passwords

//importing JWT library
const { sign } = require('jsonwebtoken');


//import middleware
const { ValidateToken } = require('../middleswares/Authmiddleware');

//to verify JWT
const { verify } = require('jsonwebtoken');

//to send emails to reset password
const nodemailer = require('nodemailer');

















// to register a user to the data base
router.post("/", async (req, res) => {
    const user = req.body;

    //to verify that username not already exist
    const usernamedetails = await Users.findOne({ where: { username: user.username } });     //i.e search where the username and email exist in the users table
    const useremaildetails = await Users.findOne({ where: { email: user.email } });     //i.e search where the username and email exist in the users table

    if (useremaildetails || usernamedetails) {
        res.json({ error: "Username already exist" });    //if there is no user, else it will continue to next line 
    } else {
        //to grap the password and hash it using bcrypt
        bcrypt.hash(user.password, 10).then((hash) => {
            Users.create({  //YOU DONT NEED TO AWAIT WHEN HASHING PASSWORD
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                username: user.username,
                password: hash
            });                     // to register the user to the users table in the database using together with the hash password

            res.json(res.statusCode)// to send the status code of the operation
        });
    }

});




//to sign in user 
router.post("/login", async (req, res) => {
    const loginDetails = req.body;

    // to get the particular user with the username from the users table in the  database if it exist
    const user = await Users.findOne({ where: { username: loginDetails.username } });

    if (!user) {
        res.json({ error: "User doesnt exist" }); //if there is no user, else it will continue to next line 
    } else {

        //to compare the password entered, with the fetch user password,  if user exist
        bcrypt.compare(loginDetails.password, user.password).then((match) => {
            if (!match) {
                res.json({ error: "Wrong password and username combo" });  //if the password is wrong compare to the user password.... it will continue automatically if its matched
            } else {
                //to generate Token
                const accessToken = sign(
                    { username: user.username, id: user.id }, //the details you want to keep secret as the JWT... secret can be any string secretive
                    "secret");

                res.json({ token: accessToken, username: user.username, id: user.id }); //then you send the JWT token to the frontend as response when detail is verify
            }
        })
    }

});


//to make sure there is security and token is valid
router.get("/auth", ValidateToken, (req, res) => {
    res.json(req.user)
})



//to check the profile of the person that create a post
router.get("/profile/:username", ValidateToken, async (req, res) => {
    const username = req.params.username;

    const user = await Users.findOne({ where: { username: username }, attributes: { exclude: ["password"] } }); //the exclude attributes was passed here to exclude the password from been fectched from the database. (exclude can contain array of prooperties you want to exclude)

    //if you are to fetch users by the id and exclude their password
    // const user = await Users.findByPk(id, {attributes: {exclude: ["password"]}}); //the exclude attributes was passed here to exclude the password from been fectched from the database. (exclude can contain array of prooperties you want to exclude)
    res.json(user);
})


//to change password of user
router.put("/changepassword", ValidateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findOne({ where: { username: req.user.username } });  //req.user.username is to get the username (from validatetoken middleware) of the user to get and verify the old password

    //to compare the oldpassword entered, with the fetch user password.
    bcrypt.compare(oldPassword, user.password).then((match) => {
        if (!match) {
            res.json({ error: "Wrong old password" });  //if the password is wrong compare to the user password.... it will continue automatically if its matched
        } else {
            //to grap the new password and hash it using bcrypt
            bcrypt.hash(newPassword, 10).then((hash) => {
                Users.update({ password: hash }, { where: { username: req.user.username } })          //{} what you want to update,,,, {} where you want to update it      
                res.json(res.statusCode)// to send the status code of the operation
            });
        }
    })
});



// to reset password
router.post("/resetpassword", async (req, res) => {
    const { email } = req.body;
    let finduser = await Users.findOne({ where: { email: email } });
    console.log(finduser);
    
    const payload = {
        email: finduser.email,
        id: finduser.id
    }

    //if the user is found create a link and send to them to reset there password
    if (finduser) {
        const token = sign(payload, "main secret", { expiresIn: '10m' });
        const link = `https://blogayfullstack.netlify.app/reset-password/${finduser.id}/${token}`;
        // const link = `http://localhost:3000/reset-password/${finduser.id}/${token}`;

        //to send link to the user email address
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'johnoliver6p@gmail.com',
              pass: 'zvlorbrzoxyxvkzb'
            }
          });
          
          let mailOptions = {
            from: 'johnoliver6p@gmail.com',
            to: payload.email,
            subject: 'Reset Password',
            text: 'Completed resetting your password with this link ' + link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          //email sending ends
        res.json("Check your email for the link to reset your password")

    } else {
        res.json("user not found")
    }

})



//verify the reset-password link if its still valid or valid
router.get("/reset-password/:id/:token", async (req, res) => {

    const { id, token } = req.params;

    //check if the id exist in the database
    let userId = await Users.findOne({ where: { id: id } })

    if (userId) {
        //verify the jwt token
        try {
            const validToken = verify(token, "main secret");
            res.json({ verify: true });  //if token is valid else send error.message
        } catch (error) {
            res.json({ error: error.message })
        }


    } else {
        res.json({ error: "Invalid user" })
    }

})



//to reset-password final stage
router.put("/reset-password", async (req, res) => {
    const { newPassword, id } = req.body;

    //to update the newpassword entered, 
    bcrypt.hash(newPassword, 10).then((hash) => {
        Users.update({ password: hash }, { where: { id: id } })          //{} what you want to update,,,, {} where you want to update it      
        res.json(res.statusCode)// to send the status code of the operation
    });

})






module.exports = router