const {
	selectArticleById,
	updateArticleVotes,
} = require('../models/articles.models');

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
