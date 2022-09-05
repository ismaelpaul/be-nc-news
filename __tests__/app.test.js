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
				expect(response.body).toEqual({ msg: 'Page not found' });
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
