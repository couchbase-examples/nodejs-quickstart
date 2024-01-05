import {
    request,
    describe,
    test,
    expect,
    app,
  } from './imports';
  
  describe('DELETE /api/v1/route/{id}', () => {
    describe('given an invalid id as request param', () => {
      test('should respond with status code 404 Not Found', async () => {
        const invalidId = 'airport_test_invalid_id';
  
        const response = await request(app).delete(`/api/v1/airport/${invalidId}`).send();
  
        expect(response.statusCode).toBe(404);
      });
    });
  });