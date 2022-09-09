const db = require('../db/connection');

exports.selectArticles = (sort_by = 'created_at', topic) => {
	const validColumns = ['created_at', 'topic'];
	if (!validColumns.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}

	let queryStr = `
	SELECT 
	articles.article_id, 
	articles.title, 
	articles.topic, 
	articles.author, 
	articles.created_at, 
	articles.votes,
	COUNT(comments.article_id)::INT AS comment_count
	FROM articles
	LEFT JOIN comments ON articles.article_id = comments.article_id
	`;
	const queryValues = [];

	if (topic) {
		queryStr += ` WHERE articles.topic = $1`;
		queryValues.push(topic);
	}

	queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} DESC;`;

	return db.query(queryStr, queryValues).then((result) => {
		if (result.rowCount === 0) {
			return Promise.reject({
				status: 404,
				msg: 'Article not found, invalid query or query has no articles.',
			});
		}
		return result.rows;
	});
};

exports.selectArticleById = (article_id) => {
	return db
		.query(
			`
			SELECT 
			articles.article_id, 
			articles.title, 
			articles.topic, 
			articles.author, 
			articles.body, 
			articles.created_at, 
			articles.votes,
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
exports.updateArticleVotes = (incrementVoteBy, article_id) => {
	const inc_votes = incrementVoteBy;

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
					return Promise.reject({
						status: 404,
						msg: `Article not found under ID ${article_id}.`,
					});
				}
				return result.rows[0];
			});
	}
};

exports.selectCommentsByArticleId = (article_id) => {
	let numberOfArticles = 0;
	return db
		.query(`SELECT articles.article_id FROM articles`)
		.then((result) => {
			numberOfArticles = result.rows.length;
		})
		.then(() => {
			return db.query(
				`
		SELECT 
		comments.body, 
		comments.votes, 
		comments.author,
		comments.comment_id,
		comments.created_at
		FROM comments
		LEFT JOIN articles ON comments.article_id = articles.article_id 
		WHERE articles.article_id = $1;
		`,
				[article_id]
			);
		})
		.then((result) => {
			if (result !== undefined) {
				if (article_id < numberOfArticles) {
					return Promise.resolve(result.rows);
				}
				return Promise.reject({
					status: 404,
					msg: `Article not found under ID ${article_id}.`,
				});
			}
			return result.rows;
		});
};
