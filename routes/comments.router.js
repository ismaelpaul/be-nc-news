const express = require('express');
const {
	patchCommentById,
	deleteCommentById,
} = require('../controllers/comments.controllers');

const commentsRouter = express.Router();

commentsRouter
	.route('/:comment_id')
	.patch(patchCommentById)
	.delete(deleteCommentById);

module.exports = commentsRouter;
