//to create the post table
module.exports = (sequelize, DataTypes) => {

    const Posts = sequelize.define("Posts", {

        //the columns in the table and their properties
        title : {
            type:DataTypes.STRING,
            allowNull:false, //it cannot be empty
        },

        postBody : {
            type:DataTypes.STRING,
            allowNull:false, //it cannot be empty
        },

        username : {
            type:DataTypes.STRING,
            allowNull:false, //it cannot be empty to known the username of the person making the post
        }

    });


    //Linking the post table to the comments table (Association)
Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {   //i.e (postId will be in the comments table through asociation) a post will have many comments 
        //adding properties
        onDelete: "cascade" //i.e on delete of a post all the comments under it will also be deleted
    });


    //to link the Post table to the Likes table (when liking a partiular post)
    Posts.hasMany(models.Likes, {   //i.e (postId will be in the Likes table through asociation) a post will have many likes 
        //adding properties
        onDelete: "cascade" //i.e on delete of a post all the comments under it will also be deleted
    });

}

    return Posts;
}