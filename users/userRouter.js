const express = require('express');

const router = express.Router();

const userDb = require('./userDb');
const postDb = require('../posts/postDb');

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id)
    .then(user => {
      if(user && user.id) {
        req.user = user;
        next();
      } else {
        res.status(400).json({  message: "Invalid user id." });
      }
    });
}

function validateUser(req, res, next) {
  if (req.body && req.body.name) {
      next();
  } else if (req.body) {
      res.status(400).json({ message: "Missing required name field." });
  } else {
    res.status(400).json({ message: "Missing user data." })
  }
}

function validatePost(req, res, next) {
  if(req.body && req.body.text) {
    next();
  } else if (req.body) {
      res.status(400).json({ message: "Missing required text field." });
  } else {
    res.status(400).json({ message: "Missing post data." })
  }
}

// CRUD

router.get('/', (req, res, next) => {
  userDb.get()
    .then( users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Users could not be retrieved." });
    })
});

router.get('/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(data=>{
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error getting the user's posts." });
    });
});

router.post('/', (req, res, next) => {
  
  userDb.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error adding the user." });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const newPost = {...req.body, user_id: req.user.id}

  postDb.insert(newPost)
    .then(postData=>{
      res.status(201).json(postData);
    })
    .catch(err=>{
      res.status(500).json({ error: "There was an error posting the post." });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.user.id)
    .then(confirmation => {
      if (confirmation > 0) {
        res.status(201).json({ message: "User was successfully deleted." });
      } else {
        res.status(500).json({ error: "There was an error deleting the user." });
      }
    })
    .catch(err=>{
      res.status(500).json({ error: "There was an error deleting the user." });
    });
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
  userDb.update(req.user.id, req.body)
    .then(confirmation => {
      if (confirmation > 0) {
        res.status(201).json({ message: "User was successfully updated." });
      } else {
        res.status(500).json({ error: "There was an error updating the user." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error updating the user." });
    });
});

module.exports = router;
