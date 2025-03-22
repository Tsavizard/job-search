import { JobPost } from './job-post.entity';

describe('JobPost', () => {
  it('should be defined', () => {
    expect(
      new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      })
    ).toBeDefined();
  });

  describe('constructor', () => {
    it('should create instance with valid inputs', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(jobPost).toBeInstanceOf(JobPost);
    });

    it('should set all properties correctly', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(jobPost.id).toBe('some_id');
      expect(jobPost.title).toBe('Developer');
      expect(jobPost.description).toBe('Description');
      expect(jobPost.salary).toBe(50000);
      expect(jobPost.employmentType).toBe('remote');
      expect(jobPost.userId).toBe('123');
    });
  });

  describe('id', () => {
    it('should accept valid id', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(jobPost.id).toBe('some_id');
    });

    it('should throw error for empty id', () => {
      expect(() => {
        new JobPost({
          id: ' ',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          employmentType: 'remote',
          userId: '123',
        });
      }).toThrow('Id cannot be empty');
    });

    it('should throw error for invalid id type', () => {
      expect(() => {
        new JobPost({
          // @ts-expect-error: Testing invalid type
          id: null,
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          employmentType: 'remote',
          userId: '123',
        });
      }).toThrow('Id must be a string');
    });
  });

  describe('salary', () => {
    it('should accept positive numbers', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 500.4,
        employmentType: 'remote',
        userId: '123',
      });
      expect(jobPost.salary).toBe(500.4);
    });

    it('should accept zero as salary', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(() => {
        jobPost.salary = 0;
      }).not.toThrow();
      expect(jobPost.salary).toBe(0);
    });

    it('should throw error for negative salary', () => {
      expect(() => {
        new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: -50000,
          employmentType: 'remote',
          userId: '123',
        });
      }).toThrow('Salary must be a positive number');
    });

    it('should reject non-numeric values', () => {
      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost('some_id', 'Title', 'Desc', '1000', 'remote', '123');
      }).toThrow('Salary must be a positive number');

      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost('some_id', 'Title', 'Desc', null, 'remote', '123');
      }).toThrow('Salary must be a positive number');
    });
  });

  describe('employmentType', () => {
    it('should accept valid employment types', () => {
      const types: ['on-site', 'hybrid', 'remote'] = [
        'on-site',
        'hybrid',
        'remote',
      ];
      types.forEach((type) => {
        const jobPost = new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          employmentType: type,
          userId: '123',
        });
        expect(jobPost.employmentType).toBe(type);
      });
    });

    it('should throw error for invalid employment type', () => {
      expect(() => {
        new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          // @ts-expect-error: Testing invalid type
          employmentType: 'invalid type',
          userId: '123',
        });
      }).toThrow('Employment type must be one of: on-site, hybrid, remote');
    });

    it('should reject employment type with wrong case', () => {
      expect(() => {
        new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          // @ts-expect-error: Testing invalid type
          employmentType: 'REMOTE',
          userId: '123',
        });
      }).toThrow('Employment type must be one of: on-site, hybrid, remote');
    });
  });

  describe('userId', () => {
    it('should accept valid userId', () => {
      const jobPost = new JobPost({
        id: 'some_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(jobPost.userId).toBe('123');
    });

    it('should throw error for empty userId', () => {
      expect(() => {
        new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          employmentType: 'remote',
          userId: ' ',
        });
      }).toThrow('UserId cannot be empty');
    });

    it('should throw error for invalid userId type', () => {
      expect(() => {
        new JobPost({
          id: 'some_id',
          title: 'Developer',
          description: 'Description',
          salary: 50000,
          employmentType: 'remote',
          // @ts-expect-error: Testing invalid type
          userId: null,
        });
      }).toThrow('UserId must be a string');
    });
  });

  describe('#save', () => {
    it('should set id when saving unsaved post', () => {
      const jobPost = new JobPost({
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      jobPost.save('new_id');
      expect(jobPost.id).toBe('new_id');
    });

    it('should throw error when saving already saved post', () => {
      const jobPost = new JobPost({
        id: 'existing_id',
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(() => jobPost.save('new_id')).toThrow(
        'Attempted to call save on a saved JobPost'
      );
    });

    it('should throw error when saving with invalid id', () => {
      const jobPost = new JobPost({
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(() => jobPost.save('')).toThrow('Id cannot be empty');
    });

    it('should throw error when saving with non-string id', () => {
      const jobPost = new JobPost({
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });
      expect(() => {
        // @ts-expect-error: Testing invalid type
        jobPost.save(123);
      }).toThrow('Id must be a string');

      expect(() => {
        // @ts-expect-error: Testing invalid type
        jobPost.save(null);
      }).toThrow('Id must be a string');
    });

    it('should ignore passing undefined as saved id', () => {
      const jobPost = new JobPost({
        title: 'Developer',
        description: 'Description',
        salary: 50000,
        employmentType: 'remote',
        userId: '123',
      });

      expect(() => {
        // @ts-expect-error: Testing invalid type
        jobPost.save(undefined);
      }).not.toThrow();
    });
  });
});
