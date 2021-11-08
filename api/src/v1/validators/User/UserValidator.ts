import { object, string } from 'yup';
import { Validator } from 'validators/Validator';
import { UserRole } from 'shared/entities/User';

export enum UserValidationSchemaName {
  CreateBody = 'createBody',
}

export class UserValidator extends Validator {
  public constructor() {
    const userValidationSchemas = new Map();

    userValidationSchemas.set(
      UserValidationSchemaName.CreateBody,
      object().shape({
        name: string().required().strict(true).trim(),
        username: string().required().strict(true).min(4).trim(),
        password: string().required().strict(true).min(8).trim(),
        role: string().oneOf(Object.values(UserRole)).required(),
      })
    );

    super(userValidationSchemas);
  }
}
