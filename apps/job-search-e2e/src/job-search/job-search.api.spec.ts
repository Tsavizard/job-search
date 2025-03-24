import axios from 'axios';

describe('Job Posts API', () => {
  let authToken: string;

  beforeAll(async () => {
    authToken = '1';
  });

  describe('GET /api/job-posts', () => {
    it('should list job posts', async () => {
      const res = await axios.get('/api/job-posts', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should reject unauthorized requests', async () => {
      await expect(axios.get('/api/job-posts')).rejects.toMatchObject({
        response: { status: 401 },
      });
    });
  });
});
