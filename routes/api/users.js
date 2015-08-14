'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user_uuid = req.params.uuid,
      selectAttributes = 'uuid name';

  if (!req.user && user_uuid === 'me') {
    res.send(new restify.NotAuthorizedError());
    return next();
  } else if (req.user && user_uuid === 'me') {
    user_uuid = req.user.uuid;
    selectAttributes = 'uuid name email';
  }

  mongoose.model('User').findOne({uuid: user_uuid})
      .select(selectAttributes)
      .exec(function (err, user) {
        if (err) {
          res.send(mongoHandler.handleError(err));
        } else {
          res.status(200).send(user);
        }
        next();
      });
  res.send('respond with a resource');
});

module.exports = router;
