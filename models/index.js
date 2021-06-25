const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create associations (to define relationships between tables)
// This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// We also need to make the reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// Associate Vote with belongsToMany() using 'through' table
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote }; // export objects with User, Post & Vote as properties