const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
		.then((result) => {
			return db
				.query(
					`
					ALTER TABLE articles 
        			ADD COLUMN comment_count INT
					DEFAULT 0
					`
				)
				.then(() => {
					return db.query(
						`UPDATE articles
						SET comment_count= (SELECT COUNT(*)
						FROM comments
						WHERE article_id=$1)
						WHERE article_id=$1
						RETURNING *;
						`,
						[article_id]
					);
				});
		})
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

	if (inc_votes === undefined) {
		return Promise.reject({ status: 400, msg: 'Bad request.' });
	} else if (typeof inc_votes !== 'number') {
		return Promise.reject({ status: 400, msg: 'Wrong data type.' });
	} else {
		return db
			.query(
				'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;',
				[inc_votes, article_id]
			)
			.then((result) => {
				if (result.rowCount === 0) {
					return Promise.reject({ status: 404, msg: 'Article not found.' });
				}
				return result.rows[0];
			});
	}
};
