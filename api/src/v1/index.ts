import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exceptionHandler } from 'middleware/exceptionHandler';
import AuthRouter from 'routers/AuthRouter/AuthRouter';
import CategoryRouter from 'routers/CategoryRouter/CategoryRouter';
import ProductRouter from 'routers/ProductRouter/ProductRouter';
import OrderRouter from 'routers/OrderRouter/OrderRouter';
import UserRouter from 'routers/UserRouter/UserRouter';
import { primaryDB } from 'providers/primaryDB';
import { UserDAO } from 'daos/UserDAO/UserDAO';
import { UserRole } from 'shared/entities/User';
import bcrypt from 'bcrypt';

const { PORT, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_NAME } = process.env;

const app = express();
const userDAO = new UserDAO();

const createAdmin = async () => {
  if (ADMIN_NAME && ADMIN_USERNAME && ADMIN_PASSWORD) {
    console.log(ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASSWORD);
    try {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await userDAO.createOne({
        username: ADMIN_USERNAME,
        role: UserRole.Admin,
        password: hash,
        name: ADMIN_NAME,
      });
      console.log(await userDAO.getOneByUsername(ADMIN_USERNAME));
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

const createEditor = async () => {
  if (ADMIN_NAME && ADMIN_USERNAME && ADMIN_PASSWORD) {
    console.log(ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASSWORD);
    try {
      const hash = await bcrypt.hash('password1234', 10);
      await userDAO.createOne({
        username: 'editor',
        role: UserRole.Editor,
        password: hash,
        name: 'Editor',
      });
      console.log(await userDAO.getOneByUsername('editor'));
    } catch (err) {
      throw new Error(err.message);
    }
  }
};

(async () => {
  console.log('bruh');
  await primaryDB.connect();

  app.use(cors());
  app.use(bodyParser.json());
  app.use('/user', UserRouter);
  app.use('/auth', AuthRouter);
  app.use('/group', CategoryRouter);
  app.use('/product', ProductRouter);
  app.use('/order', OrderRouter);
  app.use(exceptionHandler);

  await createAdmin();
  await createEditor();

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
})();

export default app;
