import axios from 'axios';

describe('Job Posts API', () => {
  const authToken =
    '3f2ecdea-02fe-48e1-bf7b-89ec6d028823.26dafafdd0de8ba46ebbdd02b1a67e04.7f7f9b79a8527b2b7c9a537f62258d2c4bf5583c82307b5199dd3eeabf66f7fb807b1614ed9b890d2a0130745d613f413ae7c05d5180764cc30c037789fba1e4';

  describe('GET /api/job-posts', () => {
    it('should reject unauthorized requests', async () => {
      await expect(axios.get('/api/job-posts')).rejects.toMatchObject({
        response: { status: 401 },
      });
    });

    it('should list job posts', async () => {
      const res = await axios.get('/api/job-posts', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 9,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should list job posts paginated', async () => {
      const res = await axios.get('/api/job-posts?limit=5&page=2', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 9,
        page: 2,
        limit: 5,
        totalPages: 2,
      });
    });

    it('should be able to search by title', async () => {
      const res = await axios.get('/api/job-posts?search=QA', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should be able to search by description', async () => {
      const res = await axios.get('/api/job-posts?search=position+for+Rust', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by work model', async () => {
      const res = await axios.get('/api/job-posts?model=on-site', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const res2 = await axios.get('/api/job-posts?model=remote', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res2.status).toBe(200);
      expect(Array.isArray(res2.data.data)).toBe(true);
      expect(res2.data.meta).toStrictEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });

      const res3 = await axios.get('/api/job-posts?model=hybrid', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res3.status).toBe(200);
      expect(Array.isArray(res3.data.data)).toBe(true);
      expect(res3.data.meta).toStrictEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by work models', async () => {
      const res = await axios.get('/api/job-posts?model=on-site&model=hybrid', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 7,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by min salary', async () => {
      const res = await axios.get('/api/job-posts?salaryMin=80000', {
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

    it('should filter by max salary', async () => {
      const res = await axios.get('/api/job-posts?salaryMax=55000', {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });

    it('should filter by salary range', async () => {
      const res = await axios.get(
        '/api/job-posts?salaryMax=80000&salaryMin=70000',
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.meta).toStrictEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });
});
