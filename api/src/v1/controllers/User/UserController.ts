import express from 'express';
import { OrderService } from 'services/Order/OrderService';
import { SuccessCode, SuccessResponse } from 'utils/response/SuccessResponse';
import { UserService } from 'services/User/UserService';
import { UserValidationSchemaName, UserValidator } from 'validators/User/UserValidator';

export class UserController {
  protected userService: UserService;
  protected orderService: OrderService;
  protected userValidator = new UserValidator();

  public constructor() {
    this.userService = new UserService();
    this.orderService = new OrderService(this.userService);
    this.userService.setOrderService(this.orderService);
  }

  public async create(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;

    const validatedBody = await this.userValidator.validate(UserValidationSchemaName.CreateBody, body);

    await this.userService.create(validatedBody);

    const successResponse = new SuccessResponse(SuccessCode.OK, 'Successfully created user');

    successResponse.send(res);
  }

  public async update(req: express.Request, res: express.Response): Promise<void> {
    const { body } = req;
    const { id } = req.params;

    const updatedUser = await this.userService.update({ _id: id, ...body });

    const successResponse = new SuccessResponse(SuccessCode.OK, updatedUser);

    successResponse.send(res);
  }

  public async getAll(_: express.Request, res: express.Response): Promise<void> {
    const users = await this.userService.getAll();

    const successResponse = new SuccessResponse(SuccessCode.OK, users);

    successResponse.send(res);
  }

  public async delete(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;

    await this.userService.delete(id);

    const successResponse = new SuccessResponse(SuccessCode.OK, 'Successfully deleted user.');

    successResponse.send(res);
  }

  public async getOneById(req: express.Request, res: express.Response): Promise<void> {
    const { id } = req.params;

    const user = await this.userService.getOneById({ _id: id });

    const successResponse = new SuccessResponse(SuccessCode.OK, user);

    successResponse.send(res);
  }

  public async getOneByUsername(_: express.Request, res: express.Response): Promise<void> {
    const { username } = res.locals;

    const user = await this.userService.getOneByUsername({ username });

    const successResponse = new SuccessResponse(SuccessCode.OK, user);

    successResponse.send(res);
  }
}
