const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const {
	getArticleById,
	patchArticleById,
	getArticles,
	getCommentsByArticleId,
} = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');

const app = express();

app.use(express.json());

//topics
app.get('/api/topics', getTopics);

// articles
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.patch('/api/articles/:article_id', patchArticleById);

//users
app.get('/api/users', getUsers);

//error handling
app.use('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page not found.' });
});

app.use((err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Invalid ID.' });
	} else if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({ msg: 'Internal Server Error!' });
	}
});

module.exports = app;
