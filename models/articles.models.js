const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	return db
		.query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
		.then((result) => {
			if (result.rowCount === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found.' });
			}
			return result.rows[0];
		});
};

exports.updateArticleVotes = (incrementVoteBy, articleId) => {
	const inc_votes = incrementVoteBy;
	const article_id = articleId;

	if (typeof inc_votes !== 'number') {
		return Promise.reject({ status: 404, msg: 'Wrong data type.' });
	} else {
		return db
			.query(
				'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
				[inc_votes, article_id]
			)
			.then((result) => {
				return result.rows[0];
			});
	}
};
