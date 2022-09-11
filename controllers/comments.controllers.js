const { removeCommentByid } = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;

	removeCommentByid(comment_id)
		.then((comment) => {
			res.status(204).send({ comment });
		})
		.catch(next);
};
