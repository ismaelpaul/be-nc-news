const express = require('express');
const { getApi } = require('../controllers/api.controllers');

const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments.router');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');

const apiRouter = express.Router();

// /api
apiRouter.get('/', getApi);

// /topics
apiRouter.use('/topics', topicsRouter);

// /articles
apiRouter.use('/articles', articlesRouter);

// /users
apiRouter.use('/users', usersRouter);

// /comments
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
