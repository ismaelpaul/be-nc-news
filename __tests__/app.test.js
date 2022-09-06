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
describe('/api/articles/:article_id', () => {
	describe('GET', () => {
		test('200: responds with a single matching article', () => {
			const article_id = 3;
			return request(app)
				.get(`/api/articles/${article_id}`)
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
					});
					expect(typeof response.body).toBe('object');
					expect(article).toHaveProperty('article_id', expect.any(Number));
					expect(article).toHaveProperty('title', expect.any(String));
					expect(article).toHaveProperty('topic', expect.any(String));
					expect(article).toHaveProperty('author', expect.any(String));
					expect(article).toHaveProperty('body', expect.any(String));
					expect(article).toHaveProperty('created_at', expect.any(String));
					expect(article).toHaveProperty('votes', expect.any(Number));
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
		test("404: responds with an error msg when user requests id that doesn't exist  ", () => {
			return request(app)
				.get('/api/articles/32993')
				.expect(404)
				.then((response) => {
					expect(response.body.msg).toEqual('Article not found.');
				});
		});
	});
});
