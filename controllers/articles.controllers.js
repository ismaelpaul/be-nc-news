const {
	selectArticleById,
	updateArticleVotes,
	selectArticles,
} = require('../models/articles.models');

exports.getArticles = (req, res, next) => {
	const { sort_by, topic } = req.query;
	selectArticles(sort_by, topic)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	const incrementVoteBy = req.body.inc_votes;
	const articleId = req.params.article_id;

	updateArticleVotes(incrementVoteBy, articleId)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
