import { Response, Service } from '@services/Service';
import { IUser } from 'shared/entities/User';

export class UserService extends Service {
  public async getUser(token: string): Promise<Response> {
    return this.get({ url: 'user', token });
  }

  public async getOne(id: string, token: string): Promise<Response> {
    return this.get({ url: `user/${id}`, token });
  }

  public async update(id: string, user: IUser, token: string): Promise<Response> {
    return this.put({ url: `user/${id}`, body: user, isJSON: true, token });
  }

  public async create(user: IUser, token: string): Promise<Response> {
    return this.post({ url: 'user', body: user, isJSON: true, token });
  }
}
