import express from 'express';
import { wrapAsync } from 'utils/wrapAsync';
import { ProductController } from 'controllers/Product/ProductController';
import { requireAuthentication } from 'middleware/requireAuthentication';

const productController = new ProductController();

const ProductRouter = express.Router();

ProductRouter.get(
  '/',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await productController.getAll(req, res);
  })
);

ProductRouter.get(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await productController.getOne(req, res);
  })
);

ProductRouter.get(
  '/search/:name',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await productController.searchByName(req, res);
  })
);

ProductRouter.put(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await productController.update(req, res);
  })
);

ProductRouter.delete(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await productController.delete(req, res);
  })
);

export default ProductRouter;
