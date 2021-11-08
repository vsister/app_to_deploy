import express from 'express';
import { wrapAsync } from 'utils/wrapAsync';
import { CategoryController } from 'controllers/Category/CategoryController';
import { ProductController } from 'controllers/Product/ProductController';
import { requireAdminPrivileges } from 'middleware/requireAdminPrivileges';
import { requireAuthentication } from 'middleware/requireAuthentication';
import { requireEditorPrivileges } from 'middleware/requireEditorPrivileges';

const categoryController = new CategoryController();
const productController = new ProductController();

const CategoryRouter = express.Router();

CategoryRouter.post(
  '/:groupId/category/:categoryId/subcategory/:subcategoryId/product',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await categoryController.createProduct(req, res);
  })
);

/**
 * Create a subcategory in a parent category in a group
 */
CategoryRouter.post(
  '/:groupId/category/:categoryId/subcategory',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await categoryController.createSubcategory(req, res);
  })
);

CategoryRouter.delete(
  '/:subcategoryId/product/:productId',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await productController.delete(req, res);
  })
);

/**
 * Create a parent category in a group
 */
CategoryRouter.post(
  '/:groupId/category',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await categoryController.createParentCategory(req, res);
  })
);

CategoryRouter.get(
  '/:id/products',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await categoryController.getSubcategoryProducts(req, res);
  })
);

CategoryRouter.get(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await categoryController.getOne(req, res);
  })
);

/**
 * Update a group, a category or a subcategory
 */
CategoryRouter.put(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await categoryController.update(req, res);
  })
);

CategoryRouter.delete(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await categoryController.delete(req, res);
  })
);

CategoryRouter.get(
  '/',
  requireAuthentication,
  wrapAsync(async (req, res) => {
    await categoryController.getCategoryGroups(req, res);
  })
);

/**
 * Create a category group
 */
CategoryRouter.post(
  '/',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireEditorPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await categoryController.createCategoryGroup(req, res);
  })
);

export default CategoryRouter;
