import { Exception, ExceptionType } from './Exception';

export class DataAccessException extends Exception {
  public constructor(message: string) {
    super(ExceptionType.DataAccessError, message);
  }
}
