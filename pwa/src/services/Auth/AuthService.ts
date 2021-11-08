import { Response, Service } from '@services/Service';

export class AuthService extends Service {
  public async authenticate(username: string, password: string): Promise<Response> {
    const body = {
      username,
      password,
    };

    return this.post({ url: 'auth', body, isJSON: true });
  }

  public async verifyToken(token: string): Promise<Response> {
    return this.get({ url: 'user', token });
  }
}
