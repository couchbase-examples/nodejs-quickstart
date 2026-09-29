import {
  request,
  describe,
  test,
  expect,
  app,
} from './imports';

describe('GET unknown route', () => {
  describe('given a path that does not match any route', () => {
    test('should respond with status code 404 Not Found', async () => {
      const response = await request(app).get('/api/v1/does-not-exist/nested').send();

      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('Not Found');
    });
  });
});
