import { JobPost } from './job-post';

describe('JobPost', () => {
  it('should be defined', () => {
    expect(
      new JobPost('some_id', 'Developer', 'Description', 50000, 'remote', '123')
    ).toBeDefined();
  });

  describe('constructor', () => {
    it('should create instance with valid inputs', () => {
      const jobPost = new JobPost(
        'some_id',
        'Developer',
        'Description',
        50000,
        'remote',
        '123'
      );
      expect(jobPost).toBeInstanceOf(JobPost);
    });

    it('should set all properties correctly', () => {
      const jobPost = new JobPost(
        'some_id',
        'Developer',
        'Description',
        50000,
        'remote',
        '123'
      );
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
      const jobPost = new JobPost(
        'some_id',
        'Title',
        'Desc',
        50000,
        'remote',
        '123'
      );
      expect(jobPost.id).toBe('some_id');
    });

    it('should throw error for empty id', () => {
      expect(() => {
        new JobPost('', 'Title', 'Desc', 50000, 'remote', '123');
      }).toThrow('Id cannot be empty');
    });

    it('should throw error for invalid id type', () => {
      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost(null, 'Title', 'Desc', 50000, 'remote', '123');
      }).toThrow('Id must be a string');
    });
  });

  describe('salary', () => {
    it('should accept positive numbers', () => {
      const jobPost = new JobPost(
        'some_id',
        'Title',
        'Desc',
        50000.4,
        'remote',
        '123'
      );
      expect(jobPost.salary).toBe(50000.4);
    });

    it('should accept zero as salary', () => {
      const jobPost = new JobPost(
        'some_id',
        'Title',
        'Desc',
        0,
        'remote',
        '123'
      );
      expect(() => {
        jobPost.salary = 0;
      }).not.toThrow();
      expect(jobPost.salary).toBe(0);
    });

    it('should throw error for negative salary', () => {
      expect(() => {
        new JobPost('some_id', 'Title', 'Desc', -1000, 'remote', '123');
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
        const jobPost = new JobPost(
          'some_id',
          'Title',
          'Desc',
          50000,
          type,
          '123'
        );
        expect(jobPost.employmentType).toBe(type);
      });
    });

    it('should throw error for invalid employment type', () => {
      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost('some_id', 'Title', 'Desc', 50000, 'invalid', '123');
      }).toThrow('Employment type must be one of: on-site, hybrid, remote');
    });

    it('should reject employment type with wrong case', () => {
      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost('some_id', 'Title', 'Desc', 50000, 'REMOTE', '123');
      }).toThrow('Employment type must be one of: on-site, hybrid, remote');
    });
  });

  describe('userId', () => {
    it('should accept valid userId', () => {
      const jobPost = new JobPost(
        'some_id',
        'Title',
        'Desc',
        50000,
        'remote',
        '123'
      );
      expect(jobPost.userId).toBe('123');
    });

    it('should throw error for empty userId', () => {
      expect(() => {
        new JobPost('some_id', 'Title', 'Desc', 50000, 'remote', '');
      }).toThrow('UserId cannot be empty');
    });

    it('should throw error for invalid userId type', () => {
      expect(() => {
        // @ts-expect-error: Testing invalid type
        new JobPost('some_id', 'Title', 'Desc', 50000, 'remote', null);
      }).toThrow('UserId must be a string');
    });
  });
});
