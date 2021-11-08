import { object, string, boolean } from 'yup';
import { Validator } from 'validators/Validator';

export enum CategoryValidationSchemaName {
  CreateCategory = 'createCategory',
}

export class CategoryValidator extends Validator {
  public constructor() {
    const categoryValidationSchemas = new Map();

    categoryValidationSchemas.set(
      CategoryValidationSchemaName.CreateCategory,
      object().shape({
        name: string().required(),
        isParent: boolean().required(),
      })
    );

    super(categoryValidationSchemas)
  }
}
