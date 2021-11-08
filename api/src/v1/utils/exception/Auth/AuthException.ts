import { Exception, ExceptionType } from '../Exception';

export class AuthException extends Exception {
  public constructor(message: string) {
    super(ExceptionType.BadToken, message);
  }
}
