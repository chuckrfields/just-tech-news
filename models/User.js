const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// Create User Model
class User extends Model {  // extends: User class inherits all of the functionality of the Model class
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
} 

// Define table columns and configuration
User.init(  // initialize data and configuration, passing in two objects as arguments.
    {
        // TABLE COLUMN DEFINITIONS

        // id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // password must be at least four characters long
                len: [4]
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS (https://sequelize.org/v5/manual/models-definition.html#configuration))
        hooks: {
            // set up beforeCreate lifecycle "hook" functionality
           async beforeCreate(newUserData) {
               newUserData.password = await bcrypt.hash(newUserData.password, 14);
               return newUserData;
           },
           // set up beforeUpdate lifecycle "hook" functionality
           async beforeUpdate(updatedUserData) {
               updatedUserData.password = await bcrypt.hash(updatedUserData.password, 14);
               return updatedUserData;
           }
        },
        // pass in our imported sequelize connection
        sequelize,
        // don't automatically created timestamp fields
        timestamps: false,
        // Don't pluralize name of table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // Keep our model name lowercase
        modelName: 'user'
    }
);

module.exports = User;