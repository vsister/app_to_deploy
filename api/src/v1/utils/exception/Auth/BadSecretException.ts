import { AuthException } from './AuthException';

export class BadSecretException extends AuthException {
  public constructor() {
    super('No JWT secret provided.');
  }
}
