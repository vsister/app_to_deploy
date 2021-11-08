import express from 'express';
import { Controller } from 'controllers/Controller';
import { ProductService } from 'services/Product/ProductService';
import { SuccessCode, SuccessResponse } from 'utils/response/SuccessResponse';
import { CategoryService } from 'services/Category/CategoryService';

export class ProductController extends Controller {
  protected categoryService = new CategoryService();
  protected productService: ProductService;

  public constructor() {
    super();

    this.productService = new ProductService(this.categoryService);
    this.categoryService.setProductService(this.productService);
  }

  public async update(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;

    const { id } = req.params;

    const updatedProduct = await this.productService.update(id, { ...body });

    const successResponse = new SuccessResponse(SuccessCode.OK, updatedProduct);

    successResponse.send(res);
  }

  public async delete(req: express.Request, res: express.Response): Promise<void> {
    const { subcategoryId, productId } = req.params;

    await this.productService.delete({ categoryId: subcategoryId, productId });

    const successResponse = new SuccessResponse(SuccessCode.OK, 'Successfully deleted product.');

    successResponse.send(res);
  }

  public async getOne(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;

    const product = await this.productService.getOne({ _id: id });

    const successResponse = new SuccessResponse(SuccessCode.OK, product);

    successResponse.send(res);
  }
  public async searchByName(req: express.Request, res: express.Response): Promise<void> {
    const { name } = req.params;
    const products = await this.productService.searchByName(name);

    const successResponse = new SuccessResponse(SuccessCode.OK, products);

    successResponse.send(res);
  }
  public async getAll(_: express.Request, res: express.Response): Promise<void> {
    const products = await this.productService.getAll();

    const successResponse = new SuccessResponse(SuccessCode.OK, products);

    successResponse.send(res);
  }
}
