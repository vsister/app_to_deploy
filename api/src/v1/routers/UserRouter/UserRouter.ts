import { Router } from 'express';
import { wrapAsync } from 'utils/wrapAsync';
import { UserController } from 'controllers/User/UserController';
import { requireAuthentication } from 'middleware/requireAuthentication';
import { requireAdminPrivileges } from 'middleware/requireAdminPrivileges';

const userController = new UserController();

const UserRouter = Router();

UserRouter.get(
  '/users',
  requireAuthentication,
  wrapAsync((req, res) => userController.getAll(req, res))
);

UserRouter.get(
  '/',
  requireAuthentication,
  wrapAsync((req, res) => userController.getOneByUsername(req, res))
);

UserRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    await userController.create(req, res);
  })
);

UserRouter.put(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireAdminPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await userController.update(req, res);
  })
);

UserRouter.delete(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireAdminPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await userController.delete(req, res);
  })
);

UserRouter.get(
  '/:id',
  requireAuthentication,
  wrapAsync(async (req, res, next) => requireAdminPrivileges(req, res, next)),
  wrapAsync(async (req, res) => {
    await userController.getOneById(req, res);
  })
);

export default UserRouter;
