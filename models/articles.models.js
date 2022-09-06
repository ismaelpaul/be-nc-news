const db = require('../db/connection');

exports.selectArticleById = (article_id) => {
	console.log(article_id, '<<< art.id2');
	return db
		.query('SELECT * FROM articles WHERE article_id=$1;', [article_id])
		.then((result) => {
			if (result.rowCount === 0) {
				return Promise.reject({ status: 404, msg: 'Article not found.' });
			}
			return result.rows[0];
		});
};
