import { Exception, ExceptionType } from './Exception';

export class DatabaseException extends Exception {
  public constructor(message: string) {
    super(ExceptionType.DatabaseError, message);
  }
}
