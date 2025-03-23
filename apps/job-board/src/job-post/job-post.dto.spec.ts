import { JobPostDto } from './job-post.dto';
import { JobPost } from './job-post.entity';

describe('JobPostDto', () => {
  it('should create a DTO from a job post entity', () => {
    const mockJobPost = new JobPost({
      id: '123',
      title: 'Software Engineer',
      description: 'Build awesome stuff',
      salary: 100000,
      workModel: 'remote',
      userId: 'user123',
    });

    const dto = JobPostDto.from(mockJobPost);

    expect(dto).toBeInstanceOf(JobPostDto);
    expect(dto.id).toBe(mockJobPost.id);
    expect(dto.title).toBe(mockJobPost.title);
    expect(dto.description).toBe(mockJobPost.description);
    expect(dto.salary).toBe(mockJobPost.salary);
    expect(dto.workModel).toBe(mockJobPost.workModel);
    expect(dto.userId).toBe(mockJobPost.userId);
  });

  it('should create an immutable DTO', () => {
    const mockJobPost = new JobPost({
      id: '123',
      title: 'Software Engineer',
      description: 'Build awesome stuff',
      salary: 100000,
      workModel: 'remote',
      userId: 'user123',
    });

    const dto = JobPostDto.from(mockJobPost);

    expect(() => {
      //@ts-expect-error Attempting to modify readonly property
      dto.title = 'New Title';
    }).toThrow();
  });
});
