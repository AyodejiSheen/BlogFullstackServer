//to create the comments table
module.exports = (sequelize, DataTypes) => {

    const Comments = sequelize.define("Comments", {

        //the columns in the table and their properties
        commentBody : {
            type:DataTypes.STRING,
            allowNull:false, //it cannot be empty
        },

        username : {
            type:DataTypes.STRING,
            allowNull:false, //it cannot be empty to known the username of the person making the post
        }

    });

    return Comments;
}