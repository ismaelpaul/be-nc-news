const db = require('../db/connection');

exports.selectArticles = (sort_by = 'created_at', topic, order = 'DESC') => {
	const validColumns = ['title', 'author', 'created_at', 'topic', 'votes'];
	if (!validColumns.includes(sort_by)) {
		return Promise.reject({ status: 400, msg: 'Bad request' });
	}

	order = order.toUpperCase();

	if (order !== 'ASC' && order !== 'DESC') {
		order = 'DESC';
	}

	return db.query('SELECT slug FROM topics').then((result) => {
		const topicSlugsArrayOfObjects = result.rows;

		const topicSlugsArray = topicSlugsArrayOfObjects.map((elem) => {
			return elem.slug;
		});

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

		queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

		return db.query(queryStr, queryValues).then((result) => {
			if (result.rowCount === 0 && topicSlugsArray.includes(topic)) {
				return Promise.resolve(result.rows);
			} else if (result.rowCount === 0) {
				return Promise.reject({
					status: 404,
					msg: 'Article not found, topic does not exist',
				});
			}
			return result.rows;
		});
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

exports.insertPost = (newComment, article_id) => {
	const { username, body } = newComment;

	if (typeof body !== 'string') {
		return Promise.reject({
			status: 400,
			msg: `Wrong data type.`,
		});
	} else if (typeof body === 'string' && body.length === 0) {
		return Promise.reject({
			status: 400,
			msg: `Empty comment.`,
		});
	}
	let usersArray = [];
	return db
		.query(
			`
	SELECT username 
	FROM users`
		)
		.then((result) => {
			usersArray = result.rows;
			const newUsersArray = usersArray.map((user) => {
				return user.username;
			});
			let checkUser = false;

			newUsersArray.forEach((userChecking) => {
				if (username === userChecking) {
					checkUser = true;
				}
			});

			if (checkUser === false) {
				return Promise.reject({
					status: 400,
					msg: `User ${username} does not exist.`,
				});
			}
			return db
				.query(
					`
			SELECT article_id 
			FROM articles`
				)
				.then((result) => {
					if (article_id > result.rows.length) {
						return Promise.reject({
							status: 404,
							msg: `ID ${article_id} does not exist.`,
						});
					}
				})
				.then(() => {
					return db
						.query(
							`
				INSERT INTO comments (body, article_id, author)
				VALUES
				($1, $2, $3)
				RETURNING *;
				`,
							[body, article_id, username]
						)
						.then((result) => {
							return result.rows[0];
						});
				});
		});
};
