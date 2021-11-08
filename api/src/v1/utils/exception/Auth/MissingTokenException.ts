import { AuthException } from './AuthException';

export class MissingTokenException extends AuthException {
  public constructor() {
    super('Bearer token not found.');
  }
}
