import express from 'express';
import { CategoryService } from 'services/Category/CategoryService';
import { ProductService } from 'services/Product/ProductService';
import { Controller } from 'controllers/Controller';
import { SuccessCode, SuccessResponse } from 'utils/response/SuccessResponse';
import { decode } from 'punycode';
import { parse } from 'path';

export class CategoryController extends Controller {
  protected categoryService: CategoryService;
  protected productService: ProductService;

  public constructor() {
    super();

    this.categoryService = new CategoryService();
    this.productService = new ProductService(this.categoryService);
    this.categoryService.setProductService(this.productService);
  }

  public async createCategoryGroup(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;

    const newCategoryGroup = await this.categoryService.createCategoryGroup({
      ...body,
      type: 'CategoryGroup',
      categories: [],
    });

    const successResponse = new SuccessResponse(SuccessCode.OK, newCategoryGroup);

    successResponse.send(res);
  }

  public async createParentCategory(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;
    const { groupId } = req.params;

    const newCategory = await this.categoryService.createParentCategory({
      ...body,
      type: 'ParentCategory',
      groupId,
      subcategories: [],
    });

    const successResponse = new SuccessResponse(SuccessCode.OK, newCategory);

    successResponse.send(res);
  }

  public async createSubcategory(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;
    const { categoryId } = req.params;

    const newCategory = await this.categoryService.createSubcategory({
      ...body,
      type: 'Subcategory',
      parentId: categoryId,
      products: [],
    });

    const successResponse = new SuccessResponse(SuccessCode.OK, newCategory);

    successResponse.send(res);
  }

  public async createProduct(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;
    const { groupId, categoryId, subcategoryId } = req.params;

    const product = await this.productService.create(groupId, categoryId, subcategoryId, body);

    const successResponse = new SuccessResponse(SuccessCode.OK, product);

    successResponse.send(res);
  }

  public async getCategoryGroups(_: express.Request, res: express.Response): Promise<void> {
    const groups = await this.categoryService.getCategoryGroups();

    const successResponse = new SuccessResponse(SuccessCode.OK, groups);

    successResponse.send(res);
  }

  public async getParentCategories(_: express.Request, res: express.Response): Promise<void> {
    const categories = await this.categoryService.getParentCategories();

    const successResponse = new SuccessResponse(SuccessCode.OK, categories);

    successResponse.send(res);
  }

  public async getOne(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;

    const category = await this.categoryService.getOne({ _id: id });

    const successResponse = new SuccessResponse(SuccessCode.OK, category);

    successResponse.send(res);
  }

  public async getSubcategoryProducts(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;
    const { page: rawPage, limit: rawLimit, filters } = req.query;

    const page = Number(rawPage || 0);
    const limit = Number(rawLimit || 10);

    const result = await this.categoryService.getSubcategoryProducts(
      id,
      page,
      limit,
      filters ? JSON.parse(decodeURIComponent(filters.toString())) : null
    );

    const response = new SuccessResponse(SuccessCode.OK, result);

    response.send(res);
  }

  public async update(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;
    const { id } = req.params;

    const updatedCategory = await this.categoryService.update(id, { ...body });

    const successResponse = new SuccessResponse(SuccessCode.OK, updatedCategory);

    successResponse.send(res);
  }

  public async delete(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;

    await this.categoryService.delete({ _id: id });

    const successResponse = new SuccessResponse(SuccessCode.OK, 'Successfully deleted category.');

    successResponse.send(res);
  }
}
