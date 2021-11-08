import yup from 'yup';
import { ValidatorSchemaMissingException } from 'utils/exception/ValidatorSchemaMissingException';
import { ValidationException } from 'utils/exception/ValidationException';

export type Schemas = Map<string, yup.ObjectSchema>;

export class Validator {
  public constructor(private readonly schemas: Schemas) {}

  public async validate(schemaName: string, data: unknown): Promise<any> {
    const schema = this.schemas.get(schemaName);

    if (!schema) {
      throw new ValidatorSchemaMissingException(schemaName);
    }

    try {
      const validation = await schema.validate(data);
      return validation;
    } catch (error) {
      throw new ValidationException(error);
    }
  }
}
