//to create the post table
module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {

        //the columns in the table and their properties
        firstname: {
            type: DataTypes.STRING,
            allowNull: false, //it cannot be empty to know the username of the person making the post
        },

        lastname: {
            type: DataTypes.STRING,
            allowNull: false, //it cannot be empty to know the username of the person making the post
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false, //it cannot be empty to know the username of the person making the post
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false, //it cannot be empty to know the username of the person making the post
        },

        password: {
            type: DataTypes.STRING,
            allowNullL: false,
        }

    });


    //Linking the user table to the post table (Association)
    Users.associate = (models) => {
        Users.hasMany(models.Posts, {   //i.e (userId will be in the post table) a user will have many post 
            //adding properties
            onDelete: "cascade" //i.e on delete of a post all the comments under it will also be deleted
        });

        //to link the users table to the Likes table (when liking a partiular post)
        Users.hasMany(models.Likes, {   //i.e (UserId will be in the Likes table through asociation) a user cal like many post
            //adding properties
            onDelete: "cascade" //i.e on delete of a post all the comments under it will also be deleted
        });



    }



    return Users;
}