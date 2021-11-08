import { AuthException } from './AuthException';

export class BadTokenException extends AuthException {
  public constructor() {
    super('Supplied token is expired or incorrect.');
  }
}
