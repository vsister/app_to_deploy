import { Exception, ExceptionType } from './Exception';

export class ValidatorSchemaMissingException extends Exception {
  public constructor(message: string) {
    super(ExceptionType.ValidatorSchemaMissing, message);
  }
}
