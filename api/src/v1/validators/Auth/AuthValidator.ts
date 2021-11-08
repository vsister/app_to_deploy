import { object, string } from 'yup';
import { Validator } from '../Validator';

export enum AuthValidatorSchema {
  Credentials = 'authCredentials',
}

export class AuthValidator extends Validator {
  public constructor() {
    const authValidationSchemas = new Map();

    authValidationSchemas.set(
      AuthValidatorSchema.Credentials,
      object().shape({
        username: string().required(),
        password: string().required(),
      })
    );

    super(authValidationSchemas)
  }
}
