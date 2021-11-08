import { Response, Service } from '@services/Service';

export class ProductService extends Service {
  public async getOne(id: string, token: string): Promise<Response> {
    return this.get({ url: `product/${id}`, token });
  }

  public async getAll(token: string): Promise<Response> {
    return this.get({ url: `product`, token });
  }

  public async update(id: string, body: any, token: string): Promise<Response> {
    return this.put({ url: `product/${id}`, body, isJSON: true, token });
  }
}
