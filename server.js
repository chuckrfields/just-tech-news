const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(express.static(path.join(__dirname, 'public')));
/*
The express.static() method is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets. This is useful for front-end specific files like images, style sheets, and JavaScript files.
*/

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {  // The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it for you!
    app.listen(PORT, () => console.log('Now listening'));

    // force: if set to TRUE this will drop and re-create all of the database tables on startup
});