import { IFilters } from '@store/slices/category';
import { Response, Service } from '../Service';

export interface GetProductsParams {
  filters?: IFilters | null;
  page: number;
  inPage: number;
}

export class CategoryService extends Service {
  public async getProducts(
    path: { groupId: string; parentId: string; categoryId: string },
    token: string,
    params: GetProductsParams
  ): Promise<Response> {
    const { categoryId } = path;
    const { filters, page, inPage } = params;

    const url = `group/${categoryId}/products?`;

    const urlParams = new URLSearchParams();

    if (filters) {
      urlParams.append('filters', encodeURIComponent(JSON.stringify(filters)));
    }

    if (page !== null) {
      urlParams.append('page', page.toString());
    }

    if (inPage) {
      urlParams.append('limit', inPage.toString());
    }

    return this.get({
      url: `${url}${urlParams.toString()}`,
      token,
    });
  }
}
