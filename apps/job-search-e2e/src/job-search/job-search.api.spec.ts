import axios from 'axios';

describe('Job Posts API', () => {
  const authToken =
    '3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4';

  describe('GET /api/job-posts', () => {
    it('should list job posts', async () => {
      const res = await axios.get('/api/job-posts', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 4,
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
