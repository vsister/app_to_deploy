import { DatabaseException } from 'utils/exception/DatabaseException';
import { MongooseModel, MongooseModelDocument } from 'daos/DAO';

import { SpecificationDAO } from './SpecificationDAO';
import {
  ICategorySpecificationSchema,
  IRadioCategorySpecificationSchema,
  IRangeCategorySpecificationSchema,
  ISelectCategorySpecificationSchema,
  RADIO_CATEGORY_SPECIFICATION_MODEL_NAME,
  RADIO_CATEGORY_SPECIFICATION_SCHEMA,
  RANGE_CATEGORY_SPECIFICATION_MODEL_NAME,
  RANGE_CATEGORY_SPECIFICATION_SCHEMA,
  SELECT_CATEGORY_SPECIFICATION_MODEL_NAME,
  SELECT_CATEGORY_SPECIFICATION_SCHEMA,
} from './schemas';
import { SpecificationType, ICategorySpecification } from 'shared/entities/Specification';

export class CategorySpecificationDAO extends SpecificationDAO {
  private selectCategorySpecificationModel: MongooseModel<ISelectCategorySpecificationSchema>;
  private radioCategorySpecificationModel: MongooseModel<IRadioCategorySpecificationSchema>;
  private rangeCategorySpecificationModel: MongooseModel<IRangeCategorySpecificationSchema<unknown>>;

  public constructor() {
    super();

    this.selectCategorySpecificationModel = this.initDiscriminator(
      this.specificationModel,
      SELECT_CATEGORY_SPECIFICATION_MODEL_NAME,
      SELECT_CATEGORY_SPECIFICATION_SCHEMA
    );

    this.radioCategorySpecificationModel = this.initDiscriminator(
      this.specificationModel,
      RADIO_CATEGORY_SPECIFICATION_MODEL_NAME,
      RADIO_CATEGORY_SPECIFICATION_SCHEMA
    );

    this.rangeCategorySpecificationModel = this.initDiscriminator(
      this.specificationModel,
      RANGE_CATEGORY_SPECIFICATION_MODEL_NAME,
      RANGE_CATEGORY_SPECIFICATION_SCHEMA
    );
  }

  public generateDocument(specification: ICategorySpecification): MongooseModelDocument<ICategorySpecificationSchema> {
    switch (specification.type) {
      case SpecificationType.Radio:
        return new this.radioCategorySpecificationModel(specification);
      case SpecificationType.Range:
        return new this.rangeCategorySpecificationModel(specification);
      case SpecificationType.Select:
        return new this.selectCategorySpecificationModel(specification);
      default:
        throw new DatabaseException(`Unknown specification`);
    }
  }

  public update(
    specificationModelDocument: MongooseModelDocument<ICategorySpecificationSchema>,
    specification: ICategorySpecification
  ): MongooseModelDocument<ICategorySpecificationSchema> {
    specificationModelDocument.overwrite(specification as any);

    return specificationModelDocument;
  }
}
