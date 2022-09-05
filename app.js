const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();

app.use('/api/topics', getTopics);

app.use('/*', (req, res, next) => {
	res.status(404).send({ msg: 'Page not found' });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
});

app.use((err, req, res) => {
	res.status(500).send({ msg: 'Internal Server Error!' });
});

module.exports = app;
