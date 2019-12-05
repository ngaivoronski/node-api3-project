const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const userRouter = require('./users/userRouter');
const postRouter = require('./posts/postRouter');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date();
  console.log(`${req.method} to ${req.originalUrl} at ${timestamp}`);
  next();
}

server.use('/api/users',helmet(), userRouter);
server.use('/api/posts', helmet(), postRouter);

module.exports = server;
