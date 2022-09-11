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
