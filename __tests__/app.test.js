const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe('/api/wrongpath', () => {
	describe('GET', () => {
		test('404: responds with an error msg when wrong path is given', () => {
			return request(app)
				.get('/api/wrongpath')
				.expect(404)
				.then((response) => {
					expect(response.body).toEqual({ msg: 'Page not found.' });
				});
		});
	});
});

describe('/api', () => {
	describe('GET', () => {
		test('200: responds with a JSON file containing description of all api endpoints', () => {
			const apis = {
				'GET /api': {
					description:
						'serves up a json representation of all the available endpoints of the api',
				},
				'GET /api/topics': {
					description: 'serves an array of all topics',
					queries: [],
					exampleResponse: {
						topics: [{ slug: 'football', description: 'Footie!' }],
					},
				},
				'GET /api/user': {
					description: 'serves an array of users',
					queries: [],
					exampleResponse: {
						user: [
							{
								username: 'butter_bridge',
								name: 'jonny',
								avatar_url:
									'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
							},
							{
								username: 'icellusedkars',
								name: 'sam',
								avatar_url:
									'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
							},
						],
					},
				},
				'GET /api/articles': {
					description: 'serves an array of all topics',
					queries: ['author', 'topic', 'sort_by', 'order'],
					exampleResponse: {
						articles: [
							{
								title: 'Seafood substitutions are increasing',
								topic: 'cooking',
								author: 'weegembump',
								body: 'Text from the article..',
								created_at: 1527695953341,
							},
						],
					},
				},
				'GET /api/articles/:article_id': {
					description: 'serves a single matching article',
					queries: [],
					exampleResponse: {
						article: [
							{
								article_id: 3,
								title: 'Eight pug gifs that remind me of mitch',
								topic: 'mitch',
								author: 'icellusedkars',
								body: 'some gifs',
								created_at: '2020-11-03T09:12:00.000Z',
								votes: 0,
								comment_count: 2,
							},
						],
					},
				},
				'PATCH /api/articles/:article_id': {
					description: 'serves an updated artile',
					queries: [],
					exampleResponse: {
						article: [
							{
								article_id: 3,
								title: 'Eight pug gifs that remind me of mitch',
								topic: 'mitch',
								author: 'icellusedkars',
								body: 'some gifs',
								created_at: '2020-11-03T09:12:00.000Z',
								votes: 1,
							},
						],
					},
				},
				'GET /api/articles/:article_id/comments': {
					description: 'serves an array of comments for the given article id',
					queries: [],
					exampleResponse: {
						articles: [
							{
								body: 'git push origin master',
								votes: 0,
								author: 'icellusedkars',
								comment_id: 10,
								created_at: '2020-11-03T09:12:00.000Z',
							},
							{
								body: 'Ambidextrous marsupial',
								votes: 0,
								author: 'icellusedkars',
								comment_id: 11,
								created_at: '2020-09-19T23:10:00.000Z',
							},
						],
					},
				},
				'POST: /api/articles/:article_id/comments': {
					description: 'serves a comment newly added to the database',
					queries: [],
					exampleResponse: {
						article: [
							{
								comment_id: 19,
								body: "I don't know",
								article_id: 2,
								author: 'icellusedkars',
								votes: 0,
								created_at: '2022-09-13T19:04:44.442Z',
							},
						],
					},
				},
				'DELETE /api/comments/:comment_id': {
					description: 'delete a specific comment and serves an empty array',
					queries: [],
					exampleResponse: [],
				},
			};
			return request(app)
				.get('/api')
				.expect(200)
				.then((response) => {
					expect(response.body).toEqual(apis);
				});
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
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles sorted by date in descending order as default', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('created_at', { descending: true });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles sorted by date and ordered by a passed order query (ASC)', () => {
			return request(app)
				.get('/api/articles?order=ASC')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('created_at', { ascending: true });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles when passed an order query that is invalid', () => {
			return request(app)
				.get('/api/articles?order=invalid')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('created_at', { descending: true });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles that are sorted by a passed sort_by query (topic)', () => {
			return request(app)
				.get('/api/articles?sort_by=topic')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('topic', { descending: true });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles that are sorted by a passed sort_by query (title)', () => {
			return request(app)
				.get('/api/articles?sort_by=title')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('title', { descending: true });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
				});
		});
		test('200: responds with an array of articles that are sorted by a passed sort_by query (title) and ordered by a passed order query (ASC)', () => {
			return request(app)
				.get('/api/articles?sort_by=title&order=ASC')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					expect(allArticles).toBeSortedBy('title', { descending: false });
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
						expect(article).toHaveProperty('votes', expect.any(Number));
						expect(article).toHaveProperty('comment_count', expect.any(Number));
					});
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
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles.length > 0).toBe(true);
					allArticles.forEach((article) => {
						expect(article).toHaveProperty('article_id', expect.any(Number));
						expect(article).toHaveProperty('title', expect.any(String));
						expect(article).toHaveProperty('topic', expect.any(String));
						expect(article).toHaveProperty('author', expect.any(String));
						expect(article).toHaveProperty('created_at', expect.any(String));
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
						'Article not found, topic does not exist'
					);
				});
		});
		test('200: responds with an empty array of articles when filtered by a passed topic query that is valid but has no articles (paper)', () => {
			return request(app)
				.get('/api/articles?topic=paper')
				.expect(200)
				.then((response) => {
					const allArticles = response.body.articles;
					expect(Array.isArray(allArticles)).toBe(true);
					expect(allArticles).toEqual([]);
				});
		});
	});
	describe('POST', () => {
		test('201: responds with comment newly added to the database', () => {
			const newArticle = {
				author: 'rogersop',
				title: "What's going on?",
				body: 'I think I know',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(201)
				.then((response) => {
					expect(response.body.article).toEqual({
						article_id: 13,
						title: "What's going on?",
						topic: 'mitch',
						author: 'rogersop',
						body: 'I think I know',
						created_at: expect.any(String),
						votes: 0,
						comment_count: expect.any(Number),
					});
				});
		});
		test('400: responds with an error msg when user gives a author with wrong data type', () => {
			const newArticle = {
				author: 2,
				title: "What's going on?",
				body: 'I think I know',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user gives a title with wrong data type', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: 42,
				body: 'I think I know',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user gives a body with wrong data type', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: "What's going on?",
				body: [],
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user gives a topic with wrong data type', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: "What's going on?",
				body: 'I think I know',
				topic: true,
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user gives a author with right data type but it is empty', () => {
			const newArticle = {
				author: '',
				title: "What's going on?",
				body: 'I think I know',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Article is not complete.');
				});
		});
		test('400: responds with an error msg when user gives a title with right data type but it is empty', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: '',
				body: 'I think I know',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Article is not complete.');
				});
		});
		test('400: responds with an error msg when user gives a body with right data type but it is empty', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: "What's going on?",
				body: '',
				topic: 'mitch',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Article is not complete.');
				});
		});
		test('400: responds with an error msg when user gives a topic with right data type but it is empty', () => {
			const newArticle = {
				author: 'icellusedkars',
				title: "What's going on?",
				body: 'I think I know',
				topic: '',
			};
			return request(app)
				.post('/api/articles')
				.send(newArticle)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Article is not complete.');
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
					expect(response.body.msg).toEqual(
						'Article not found under ID 329933.'
					);
				});
		});
		test('400: responds with an error msg when user requests an article update with wrong data type', () => {
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

describe('/api/articles/:article_id/comments', () => {
	describe('GET', () => {
		test('200: responds with an array of comments for the given article id', () => {
			return request(app)
				.get('/api/articles/3/comments')
				.expect(200)
				.then((response) => {
					const allComments = response.body.comments;
					expect(Array.isArray(allComments)).toBe(true);
					expect(allComments.length > 0).toBe(true);
					allComments.forEach((comment) => {
						expect(comment).toHaveProperty('body', expect.any(String));
						expect(comment).toHaveProperty('votes', expect.any(Number));
						expect(comment).toHaveProperty('author', expect.any(String));
						expect(comment).toHaveProperty('comment_id', expect.any(Number));
						expect(comment).toHaveProperty('created_at');
					});
				});
		});
		test('200: responds with an empty array of comments when the article id is valid but has no comments', () => {
			return request(app)
				.get('/api/articles/8/comments')
				.expect(200)
				.then((response) => {
					const allComments = response.body.comments;
					expect(Array.isArray(allComments)).toBe(true);
					expect(allComments).toEqual([]);
				});
		});
		test('400: responds with an error msg when user requests comments with invalid id', () => {
			return request(app)
				.get('/api/articles/invalid/comments')
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test("404: responds with an error msg when user requests comments with an id that doesn't exist", () => {
			return request(app)
				.get('/api/articles/32993/comments')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual(
						'Article not found under ID 32993.'
					);
				});
		});
	});
	describe('POST', () => {
		test('201: responds with comment newly added to the database', () => {
			const newComment = {
				username: 'icellusedkars',
				body: "I don't know",
			};
			return request(app)
				.post('/api/articles/2/comments')
				.send(newComment)
				.expect(201)
				.then((response) => {
					const comment = response.body.comment;
					expect(comment).toEqual({
						comment_id: 19,
						votes: 0,
						created_at: expect.any(String),
						author: 'icellusedkars',
						body: "I don't know",
						article_id: 2,
					});
				});
		});
		test('400: responds with an error msg when user tries to post a comment with invalid id', () => {
			const newComment = {
				username: 'icellusedkars',
				body: "I don't know",
			};
			return request(app)
				.post('/api/articles/invalid/comments')
				.send(newComment)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test('404 responds with an error msg when user tries to post a comment with id that does not exist', () => {
			const newComment = {
				username: 'icellusedkars',
				body: "I don't know",
			};
			return request(app)
				.post('/api/articles/32993/comments')
				.send(newComment)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('ID 32993 does not exist.');
				});
		});
		test('400: responds with an error msg when user gives a body with wrong data type', () => {
			const newComment = {
				username: 'icellusedkars',
				body: true,
			};
			return request(app)
				.post('/api/articles/3/comments')
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toEqual('Wrong data type.');
				});
		});
		test('400: responds with an error msg when user gives a body with right data type but it is empty', () => {
			const newComment = {
				username: 'icellusedkars',
				body: '',
			};
			return request(app)
				.post('/api/articles/3/comments')
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toEqual('Empty comment.');
				});
		});
		test('400: responds with an error msg when user does not exist', () => {
			const newComment = {
				username: 'jarbas',
				body: "I don't know",
			};
			return request(app)
				.post('/api/articles/3/comments')
				.send(newComment)
				.expect(400)
				.then((result) => {
					expect(result.body.msg).toEqual('User jarbas does not exist.');
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

describe('/api/users/:username', () => {
	describe('GET', () => {
		test('200: responds with a single matching user', () => {
			return request(app)
				.get('/api/users/lurker')
				.expect(200)
				.then((response) => {
					const user = response.body.user;
					expect(user).toEqual([
						{
							username: 'lurker',
							name: 'do_nothing',
							avatar_url:
								'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
						},
					]);
				});
		});
		test('404: responds with an error msg when requests a user that does not exist', () => {
			return request(app)
				.get('/api/users/boris')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('User boris not found.');
				});
		});
	});
});

describe('/api/comment/:comment_id', () => {
	describe('DELETE', () => {
		test('204: responds with an empty response body', () => {
			return request(app).delete('/api/comments/3').expect(204);
		});
		test('400: responds with an error msg when user tries to delete comment with invalid id ', () => {
			return request(app)
				.delete('/api/comments/invalid')
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test('404: responds with an error msg when user tries to delete comment with a valid id but id does not exist', () => {
			return request(app)
				.delete('/api/comments/93939')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('ID 93939 does not exist.');
				});
		});
	});
	describe('PATCH', () => {
		test('200: responds with the updated comment', () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/comments/3')
				.send(increasingVotes)
				.expect(200)
				.then((response) => {
					const updatedComment = {
						comment_id: 3,
						body: 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.',
						article_id: 1,
						author: 'icellusedkars',
						votes: 101,
						created_at: '2020-03-01T01:13:00.000Z',
					};
					expect(response.body.comment).toEqual(updatedComment);
				});
		});
		test('400: responds with an error msg when user requests to update a comment with an invalid id', () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/comments/invalid')
				.send(increasingVotes)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Invalid ID.');
				});
		});
		test("404: responds with an error msg when user requests to update a comment with an id that doesn't exist", () => {
			const newVotes = 1;
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/comments/396333')
				.send(increasingVotes)
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual(
						'Comment not found under ID 396333.'
					);
				});
		});
		test('400: responds with an error msg when user requests a comment update with wrong data type', () => {
			const newVotes = 'wrongtype';
			const increasingVotes = {
				inc_votes: newVotes,
			};
			return request(app)
				.patch('/api/comments/3')
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
				.patch('/api/comments/3')
				.send(increasingVotes)
				.expect(400)
				.then((response) => {
					expect(response.body.msg).toEqual('Bad request.');
				});
		});
	});
});
