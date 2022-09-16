const db = require('../db/connection');

exports.removeCommentByid = (comment_id) => {
	return db
		.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [
			comment_id,
		])
		.then((result) => {
			if (result.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: `ID ${comment_id} does not exist.`,
				});
			}

			return result.rows[0];
		});
};

exports.updateCommentVotes = (incrementVotesBy, comment_id) => {
	if (incrementVotesBy === undefined) {
		return Promise.reject({ status: 400, msg: 'Bad request.' });
	} else if (typeof incrementVotesBy !== 'number') {
		return Promise.reject({ status: 400, msg: 'Wrong data type.' });
	}
	return db
		.query(
			`
	UPDATE comments SET votes = votes + $1
	WHERE comment_id = $2
	RETURNING *;`,
			[incrementVotesBy, comment_id]
		)
		.then((result) => {
			if (result.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: `Comment not found under ID ${comment_id}.`,
				});
			}
			return result.rows[0];
		});
};
