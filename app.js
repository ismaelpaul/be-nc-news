const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getArticleById } = require('./controllers/articles.controllers');
const { getUsers } = require('./controllers/users.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/users', getUsers);

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
