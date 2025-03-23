import assert from 'node:assert';

export class JobPost {
  title: string;
  description: string;
  private _salary!: number;
  private _workModel!: TWorkModel;
  private _userId!: string;
  private _id?: string;

  constructor({
    id,
    title,
    description,
    salary,
    workModel,
    userId,
  }: JobPostParams) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.salary = salary;
    this.workModel = workModel;
    this.userId = userId;
  }

  get salary() {
    return this._salary;
  }

  set salary(newSalary: number) {
    this.isValidSalary(newSalary);
    this._salary = newSalary;
  }

  get workModel() {
    return this._workModel;
  }

  set workModel(newType: TWorkModel) {
    this.isValidWorkModel(newType);
    this._workModel = newType;
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

  private set id(newId: string | undefined) {
    if (newId === undefined) return;

    this.isValidId(newId);
    this._id = newId.trim();
  }

  save(id: string) {
    assert.equal(
      this.id,
      undefined,
      'Attempted to call save on a saved JobPost'
    );
    this.id = id;
  }

  private isValidSalary(potentialSalary: unknown): potentialSalary is number {
    if (typeof potentialSalary === 'number' && potentialSalary >= 0)
      return true;

    throw new Error('Salary must be a positive number');
  }

  private isValidWorkModel(
    potentialWorkModel: unknown
  ): potentialWorkModel is TWorkModel {
    if (workModelSet.has(potentialWorkModel as TWorkModel)) return true;

    throw new Error('Work model must be one of: on-site, hybrid, remote');
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

const workModelSet = new Set<TWorkModel>(['on-site', 'hybrid', 'remote']);

export type TWorkModel = 'on-site' | 'hybrid' | 'remote';

type JobPostParams = {
  id?: string;
  title: string;
  description: string;
  salary: number;
  workModel: TWorkModel;
  userId: string;
};
