import express from 'express';
import { AuthService } from 'services/Auth/AuthService';
import {
  AuthValidator,
  AuthValidatorSchema,
} from 'validators/Auth/AuthValidator';
import { SuccessCode, SuccessResponse } from 'utils/response/SuccessResponse';

export class AuthController {
  protected authService = new AuthService();
  protected authValidator = new AuthValidator();

  public async authenticate(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const { body } = req;

    const validatedBody = await this.authValidator.validate(
      AuthValidatorSchema.Credentials,
      body
    );

    const token = await this.authService.authenticate(validatedBody);

    const response = new SuccessResponse(SuccessCode.OK, token);

    response.send(res);
  }
}
