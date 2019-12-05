const express = require('express');

const router = express.Router();

const userDb = require('../users/userDb');
const postDb = require('./postDb');

// custom middleware

function validatePostId(req, res, next) {
  postDb.getById(req.params.id)
    .then(post => {
      if(post && post.id) {
        req.post = post;
        next();
      } else {
        res.status(400).json({  message: "Invalid post id." });
      }
    });
}

function validatePost(req, res, next) {
  if (req.body && req.body.text) {
      next();
  } else if (req.body) {
      res.status(400).json({ message: "Missing required text field." });
  } else {
    res.status(400).json({ message: "Missing post data." })
  }
}

// CRUD

router.get('/', (req, res) => {
  postDb.get()
    .then( users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Posts could not be retrieved." });
    })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  postDb.remove(req.post.id)
    .then(confirmation => {
      if (confirmation > 0) {
        res.status(201).json({ message: "The post was successfully deleted." });
      } else {
        res.status(500).json({ error: "There was an error deleting the post." });
      }
    })
    .catch(err=>{
      res.status(500).json({ error: "There was an error deleting the post." });
    });
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  console.log(req.body);
  postDb.update(req.post.id, req.body)
    .then(confirmation => {
      if (confirmation > 0) {
        res.status(201).json({ message: "Post was successfully updated." });
      } else {
        res.status(500).json({ error: "There was an error updating the post." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "There was an error updating the post." });
    });
});

module.exports = router;
