import { Response, Service } from '@services/Service';

export class CatalogueService extends Service {
  public async getCatalogue(token: string): Promise<Response> {
    return this.get({ url: 'group', token });
  }

  public async createGroup(groupName: string, token: string): Promise<Response> {
    return this.post({ url: 'group', body: { name: groupName }, isJSON: true, token });
  }

  public async updateGroup(groupId: string, name: string, token: string): Promise<Response> {
    return this.put({ url: `group/${groupId}`, body: { name }, isJSON: true, token });
  }

  public async deleteGroup(groupId: string, token: string): Promise<Response> {
    return this.delete({ url: `group/${groupId}`, token });
  }

  public async createCategory(groupId: string, categoryName: string, token: string): Promise<Response> {
    return this.post({ url: `group/${groupId}/category`, body: { name: categoryName }, isJSON: true, token });
  }

  public async updateCategory(categoryId: string, name: string, token: string): Promise<Response> {
    return this.put({ url: `group/${categoryId}`, body: { name }, isJSON: true, token });
  }

  public async deleteCategory(categoryId: string, token: string): Promise<Response> {
    return this.delete({ url: `group/${categoryId}`, token });
  }

  public async createSubcategory(groupId: string, categoryId: string, body: any, token: string): Promise<Response> {
    return this.post({ url: `group/${groupId}/category/${categoryId}/subcategory`, body, isJSON: true, token });
  }

  public async updateSubcategory(categoryId: string, body: any, token: string): Promise<Response> {
    return this.put({ url: `group/${categoryId}`, body, isJSON: true, token });
  }

  public async deleteSubcategory(categoryId: string, token: string): Promise<Response> {
    return this.delete({ url: `group/${categoryId}`, token });
  }

  public async createProduct(
    groupId: string,
    categoryId: string,
    subcategoryId: string,
    body: any,
    token: string
  ): Promise<Response> {
    return this.post({
      url: `group/${groupId}/category/${categoryId}/subcategory/${subcategoryId}/product`,
      body,
      isJSON: true,
      token,
    });
  }
}
