import express from 'express';
import { OrderController } from 'controllers/Order/OrderController';
import { wrapAsync } from 'utils/wrapAsync';

const orderController = new OrderController();

const OrderRouter = express.Router();

OrderRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    await orderController.create(req, res);
  })
);

OrderRouter.get(
  '/',
  wrapAsync(async (req, res) => {
    await orderController.getMany(req, res);
  })
);

OrderRouter.get(
  '/:orderId',
  wrapAsync(async (req, res) => {
    await orderController.getOne(req, res);
  })
);

OrderRouter.get(
  '/:orderId/document',
  wrapAsync(async (req, res) => {
    await orderController.getDocument(req, res);
  })
);

export default OrderRouter;
