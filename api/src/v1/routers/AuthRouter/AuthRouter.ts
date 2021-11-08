import { Router } from 'express';
import { wrapAsync } from 'utils/wrapAsync';
import { AuthController } from 'controllers/AuthController/AuthController';

const authController = new AuthController();

const AuthRouter = Router();

AuthRouter.post(
  '/',
  wrapAsync(async (req, res) => {
    await authController.authenticate(req, res);
  })
);

export default AuthRouter;
