import { Service } from '@services/Service';

export class SearchService extends Service {
  public async searchByName(name: string, token: string) {
    return this.get({ url: `product/search/${name}`, token });
  }
}
