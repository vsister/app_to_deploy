export enum ExceptionType {
  ValidationFailed = 'validationFailed',
  ValidatorSchemaMissing = 'validatorSchemaMissing',
  BadToken = 'badToken',
  DatabaseError = 'databaseError',
  DataAccessError = 'dataAccessError',
  ModelError = 'modelError',
}

export class Exception {
  public constructor(private readonly type: ExceptionType, private readonly _message: string) {}

  public get message(): string {
    return `${this.type}: ${this._message}`;
  }
}
