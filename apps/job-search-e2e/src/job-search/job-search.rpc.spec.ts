import axios from 'axios';

describe('Job Posts rpc', () => {
  let authToken: string;

  const validJobPost = {
    id: '1',
    title: 'Software Engineer',
    description: 'Test description',
    salary: 50000,
    workModel: 'remote',
    userId: '1',
  };

  beforeAll(async () => {
    authToken = 'sadas';
  });

  describe('POST /rpc/job-posts', () => {
    it('should create a job post', async () => {
      const res = await axios.post('/rpc/job-posts', validJobPost, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      expect(res.status).toBe(201);
    });

    it('should reject invalid job post data', async () => {
      await expect(
        axios.post(
          '/rpc/job-posts',
          { ...validJobPost, salary: 'invalid' },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        )
      ).rejects.toMatchObject({ response: { status: 400 } });
    });
  });

  describe('DELETE /rpc/job-posts/:id', () => {
    it('should delete a job post', async () => {
      const res = await axios.delete(`/rpc/job-posts/1`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      expect(res.status).toBe(204);
    });

    it('should return 404 for deleting non-existent post', async () => {
      await expect(
        axios.delete('/rpc/job-posts/999999', {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      ).rejects.toMatchObject({ response: { status: 404 } });
    });
  });
});
