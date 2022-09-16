const {
	removeCommentByid,
	updateCommentVotes,
} = require('../models/comments.models');

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;

	removeCommentByid(comment_id)
		.then((comment) => {
			res.status(204).send({ comment });
		})
		.catch(next);
};

exports.patchCommentById = (req, res, next) => {
	const incrementVotesBy = req.body.inc_votes;
	const { comment_id } = req.params;

	updateCommentVotes(incrementVotesBy, comment_id)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};
