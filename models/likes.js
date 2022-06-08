

//to create the likes table---- there wont be a specified column in the table with will be associtaion of the id of the post liked and the id of the user that like the post


module.exports = (sequelize, DataTypes) => {

    const Likes = sequelize.define("Likes", {

    });

    return Likes;
}