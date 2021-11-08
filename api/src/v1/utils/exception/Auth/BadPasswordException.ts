import { AuthException } from './AuthException';

export class BadPasswordException extends AuthException {
  public constructor() {
    super('Supplied password is incorrect.');
  }
}
