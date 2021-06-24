const router = require('express').Router();

const apiRoutes = require('./api');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).end();  // This is so if we make a request to any endpoint that doesn't exist, we'll receive a 404 error indicating we have requested an incorrect resource, another RESTful API practice.
});

module.exports = router;