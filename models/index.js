const User = require('./User');
const Post = require('./Post');

// create associations (to define relationships between tables)
// This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// We also need to make the reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post }; // export objects with User & Post as properties