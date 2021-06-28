const router = require('express').Router();
const { read } = require('fs');
const { User, Post, Vote, Comment } = require('../../models');

// RESTful APIs: Representational State Transfer

/* REST is an API architectural pattern 
Guidelines for REST include:

- Name your endpoints in a way that describes the data you're interfacing with, such as /api/users.

- Use HTTP methods like GET, POST, PUT, and DELETE to describe the action you're performing to interface with that endpoint; 
for example, GET /api/users means you should expect to receive user data.

- Use the proper HTTP status codes like 400, 404, and 500 to indicate errors in a request.

*/

// GET /api/users endpoint
router.get('/', (req, res) => {
    // Access User model and run .findAll() method
    User.findAll( {
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password']},
        where: {
            id: req.params.id
        },
        include: [
            {
              model: Post,
              attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
              model: Post,
              attributes: ['title'],
              through: Vote,
              as: 'voted_posts'
            }
          ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id '});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    User.create({ //  Pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json( { message: 'Unable to login ' }); // Email not found in system, no need to tell user!
            return;
        }

        // verify user
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json( { message: 'Invalid password' });
            return;
        }

        res.json( { user: dbUserData, message: 'You are now logged in' });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    User.update(req.body, {  // We pass in req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used
        individualHooks: true,  // need individualHooks for bcrypt hashing
        where: {
            id: req.params.id 
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json( { message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy( {
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;