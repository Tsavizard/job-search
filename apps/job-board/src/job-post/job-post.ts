export class JobPost {
  title: string;
  description: string;
  private _salary!: number;
  private _employmentType!: TEmploymentType;
  private _userId!: string;
  private _id!: string;

  constructor(
    id: string,
    title: string,
    description: string,
    salary: number,
    employmentType: TEmploymentType,
    userId: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.salary = salary;
    this.employmentType = employmentType;
    this.userId = userId;
  }

  get salary() {
    return this._salary;
  }

  set salary(newSalary: number) {
    this.isValidSalary(newSalary);
    this._salary = newSalary;
  }

  get employmentType() {
    return this._employmentType;
  }

  set employmentType(newType: TEmploymentType) {
    this.isValidEmploymentType(newType);
    this._employmentType = newType;
  }

  get userId() {
    return this._userId;
  }

  private set userId(newUserId: string) {
    this.isValidUserId(newUserId);
    this._userId = newUserId.trim();
  }

  get id() {
    return this._id;
  }

  private set id(newId: string) {
    this.isValidId(newId);
    this._id = newId.trim();
  }

  private isValidSalary(potentialSalary: unknown): potentialSalary is number {
    if (typeof potentialSalary === 'number' && potentialSalary >= 0)
      return true;

    throw new Error('Salary must be a positive number');
  }

  private isValidEmploymentType(
    potentialEmployment: unknown
  ): potentialEmployment is TEmploymentType {
    if (employmentTypeSet.has(potentialEmployment as TEmploymentType))
      return true;

    throw new Error('Employment type must be one of: on-site, hybrid, remote');
  }

  private isValidUserId(uid: unknown): uid is string {
    if (typeof uid !== 'string') throw new Error('UserId must be a string');
    if (uid.trim().length === 0) throw new Error('UserId cannot be empty');

    return true;
  }

  private isValidId(id: unknown): id is string {
    if (typeof id !== 'string') throw new Error('Id must be a string');
    if (id.trim().length === 0) throw new Error('Id cannot be empty');

    return true;
  }
}

const employmentTypeSet = new Set<TEmploymentType>([
  'on-site',
  'hybrid',
  'remote',
]);

type TEmploymentType = 'on-site' | 'hybrid' | 'remote';
