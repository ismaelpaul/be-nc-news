const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('Wrong requests', () => {
	test('404: responds with an error msg when wrong path is given', () => {
		return request(app)
			.get('/api/wrongpath')
			.expect(404)
			.then((response) => {
				expect(response.body).toEqual({ msg: 'Page not found.' });
			});
	});
});

describe('/api/topics', () => {
	describe('GET', () => {
		test('200: responds with an array of topic objects', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then((response) => {
					const allTopics = response.body.topic;
					expect(typeof response.body).toBe('object');
					expect(Array.isArray(allTopics)).toBe(true);
					expect(allTopics.length > 0).toBe(true);
					allTopics.forEach((topic) => {
						expect(topic).toHaveProperty('slug', expect.any(String));
						expect(topic).toHaveProperty('description', expect.any(String));
					});
				});
		});
	});
});
describe('/api/articles', () => {
	describe('GET', () => {
		test('200: responds with an array of articles', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at');
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles sorted by date in descending order', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(allArticles).toBeSortedBy('created_at', { descending: true });
				});
		});
		test('200: responds with an array of articles that are sorted by a passed sort_by query', () => {
			return request(app)
				.get('/api/articles?sort_by=topic')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(allArticles).toBeSortedBy('topic', { descending: true });
				});
		});
		test('400: responds with an error msg for a sort_by that is not an existing column', () => {
			return request(app)
				.get('/api/articles?sort_by=not_a_column')
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toBe('Bad request');
				});
		});
		test('200: responds with an array of articles that are filtered by a passed topic query', () => {
			return request(app)
				.get('/api/articles?topic=cats')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(allArticles.length).toBeGreaterThan(0);
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at');
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('404: responds with an error msg when filtered by a passed topic query that is invalid', () => {
			return request(app)
				.get('/api/articles?topic=invalid-topic')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe(
						'Article not found, invalid query or query has no articles.'
					);
				});
		});
		test('404: responds with an error msg when filtered by a passed topic query that is valid but has no articles', () => {
			return request(app)
				.get('/api/articles?topic=paper')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toBe(
						'Article not found, invalid query or query has no articles.'
					);
				});
		});
	});
});
describe('/api/articles/:article_id', () => {
	describe('GET', () => {
		test('200: responds with a single matching article', () => {
			return request(app)
				.get('/api/articles/3')
				.expect(200)
				.then((response) => {
					const article = response.body.article;
					expect(article).toEqual({
						article_id: 3,
						title: 'Eight pug gifs that remind me of mitch',
						topic: 'mitch',
						author: 'icellusedkars',
						body: 'some gifs',
						created_at: '2020-11-03T09:12:00.000Z',
						votes: 0,
						comment_count: 2,
					});
				});
		});
		test('400: responds with an error msg when user requests invalid id', () => {
			return request(app)
				.get('/api/articles/invalid')
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test("404: responds with an error msg when user requests id that doesn't exist", () => {
			return request(app)
				.get('/api/articles/32993')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('Article not found.');
				});
		});
	});
	describe('PATCH', () => {
		test('200: responds with the updated article', () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/articles/3')
				.send(increasingVotes)
				.expect(200)
				.then((response) => {
					const updatedArticle = {
						article_id: 3,
						title: 'Eight pug gifs that remind me of mitch',
						topic: 'mitch',
						author: 'icellusedkars',
						body: 'some gifs',
						created_at: '2020-11-03T09:12:00.000Z',
						votes: 1,
					};
					expect(response.body.article).toEqual(updatedArticle);
				});
		});
		test('400: responds with an error msg when user requests invalid id', () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/articles/invalid')
				.send(increasingVotes)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test("404: responds with an error msg when user requests id that doesn't exist", () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/articles/329933')
				.send(increasingVotes)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('Article not found.');
				});
		});
		test('400: responds with an error msg when user requests an update with wrong data type', () => {
			const newVotes = 'wrongtype';
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/articles/3')
				.send(increasingVotes)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user requests an update with missing key', () => {
			const increasingVotes = {
				page: 3,
			};
			return request(app)
				.patch('/api/articles/3')
				.send(increasingVotes)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Bad request.');
				});
		});
	});
});

describe('/api/users', () => {
	describe('GET', () => {
		test('200: responds with an array of user objects', () => {
			return request(app)
				.get('/api/users')
				.expect(200)
				.then((response) => {
					const allUsers = response.body.user;
					expect(typeof response.body).toBe('object');
					expect(Array.isArray(allUsers)).toBe(true);
					allUsers.forEach((user) => {
						expect(user).toHaveProperty('username', expect.any(String));
						expect(user).toHaveProperty('name', expect.any(String));
						expect(user).toHaveProperty('avatar_url', expect.any(String));
					});
				});
		});
	});
});
