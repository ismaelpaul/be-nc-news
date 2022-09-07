const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	return db
		.query(
			`
			SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes,
			COUNT(comments.article_id)::INT AS comment_count
			FROM articles
			LEFT JOIN comments ON articles.article_id = comments.article_id 
			WHERE articles.article_id=$1
			GROUP BY articles.article_id;`,
			[article_id]
		)
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
