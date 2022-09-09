const {
	selectArticleById,
	updateArticleVotes,
	selectArticles,
	selectCommentsByArticleId,
	insertPost,
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
	const { article_id } = req.params;

	updateArticleVotes(incrementVoteBy, article_id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
	const { article_id } = req.params;

	selectCommentsByArticleId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.postCommentByArticleId = (req, res, next) => {
	const { article_id } = req.params;
	const newComment = req.body;
	insertPost(newComment, article_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};
