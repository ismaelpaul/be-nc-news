const express = require('express');
const {
	getArticles,
	getArticleById,
	getCommentsByArticleId,
	postArticle,
	postCommentByArticleId,
	patchArticleById,
} = require('../controllers/articles.controllers');

const articlesRouter = express.Router();

articlesRouter.route('/').get(getArticles).post(postArticle);
articlesRouter
	.route('/:article_id')
	.get(getArticleById)
	.patch(patchArticleById);

articlesRouter
	.route('/:article_id/comments')
	.get(getCommentsByArticleId)
	.post(postCommentByArticleId);

module.exports = articlesRouter;
