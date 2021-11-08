import { Exception, ExceptionType } from './Exception';

export class ValidationException extends Exception {
  public constructor(message: string) {
    super(ExceptionType.ValidationFailed, message);
  }
}
