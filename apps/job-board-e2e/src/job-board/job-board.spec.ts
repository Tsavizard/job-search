import axios from 'axios';

describe('Job Posts API', () => {
  const validJobPost = {
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'remote',
  };

  let createdPostId: string;
  let authToken: string;

  beforeAll(async () => {
    '3f2ecdea-02fe-48e1-bf7b-89ec6d028823';
  });

  describe('POST /api/job-posts', () => {
    it('should create a job post', async () => {
      const res = await axios.post('/api/job-posts', validJobPost, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(res.status).toBe(201);
      expect(res.data.title).toBe(validJobPost.title);
      expect(res.data.id).toBeDefined();
      createdPostId = res.data.id;
    });

    it('should reject invalid job post data', async () => {
      await expect(
        axios.post(
          '/api/job-posts',
          { ...validJobPost, salary: 'invalid' },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
      ).rejects.toMatchObject({ response: { status: 400 } });
    });
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

  describe('GET /api/job-posts/:id', () => {
    it('should get a specific job post', async () => {
      const res = await axios.get(`/api/job-posts/${createdPostId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(createdPostId);
    });

    it('should return 404 for non-existent post', async () => {
      await expect(
        axios.get('/api/job-posts/999999', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      ).rejects.toMatchObject({ response: { status: 404 } });
    });
  });

  describe('PUT /api/job-posts/:id', () => {
    it('should update a job post', async () => {
      const updates = { ...validJobPost, title: 'Updated Title' };
      const res = await axios.put(`/api/job-posts/${createdPostId}`, updates, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.title).toBe(updates.title);
    });

    it('should reject invalid updates', async () => {
      await expect(
        axios.put(
          `/api/job-posts/${createdPostId}`,
          { title: '' },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
      ).rejects.toMatchObject({ response: { status: 400 } });
    });
  });

  describe('DELETE /api/job-posts/:id', () => {
    it('should delete a job post', async () => {
      const res = await axios.delete(`/api/job-posts/${createdPostId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(204);
    });

    it('should return 404 for deleting non-existent post', async () => {
      await expect(
        axios.delete('/api/job-posts/999999', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      ).rejects.toMatchObject({ response: { status: 404 } });
    });
  });
});
