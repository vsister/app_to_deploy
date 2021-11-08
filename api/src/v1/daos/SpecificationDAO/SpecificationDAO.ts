import { DAO, MongooseModel, MongooseModelDocument } from 'daos/DAO';

import { ISpecificationSchema, SPECIFICATION_MODEL_NAME, SPECIFICATION_SCHEMA } from './schemas';
import { ISpecification } from 'shared/entities/Specification';

export abstract class SpecificationDAO extends DAO {
  protected specificationModel: MongooseModel<ISpecificationSchema>;

  public constructor() {
    super();

    this.specificationModel = this.initModel(SPECIFICATION_MODEL_NAME, SPECIFICATION_SCHEMA);
  }

  public abstract generateDocument(specification: ISpecification): MongooseModelDocument<ISpecificationSchema>;

  public abstract update(
    specificationModelDocument: MongooseModelDocument<ISpecificationSchema>,
    specification: ISpecification
  ): MongooseModelDocument<ISpecificationSchema>;
}
