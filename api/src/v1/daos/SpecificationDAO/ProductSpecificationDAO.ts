import { DatabaseException } from 'utils/exception/DatabaseException';
import { MongooseModel, MongooseModelDocument } from 'daos/DAO';

import { SpecificationDAO } from './SpecificationDAO';
import {
  IProductSpecificationSchema,
  IRadioProductSpecificaitonSchema,
  IRangeProductSpecificaitonSchema,
  ISelectProductSpecificaitonSchema,
  RADIO_PRODUCT_SPECIFICATION_MODEL_NAME,
  RADIO_PRODUCT_SPECIFICATION_SCHEMA,
  RANGE_PRODUCT_SPECIFICATION_MODEL_NAME,
  RANGE_PRODUCT_SPECIFICATION_SCHEMA,
  SELECT_PRODUCT_SPECIFICATION_MODEL_NAME,
  SELECT_PRODUCT_SPECIFICATION_SCHEMA,
} from './schemas';
import { SpecificationType, IProductSpecification } from 'shared/entities/Specification';

export class ProductSpecificationDAO extends SpecificationDAO {
  private selectProductSpecificationModel: MongooseModel<ISelectProductSpecificaitonSchema>;
  private rangeProductSpecificationModel: MongooseModel<IRangeProductSpecificaitonSchema>;
  private radioProductSpecificationModel: MongooseModel<IRadioProductSpecificaitonSchema>;

  public constructor() {
    super();

    this.selectProductSpecificationModel = this.initDiscriminator(
      this.specificationModel,
      SELECT_PRODUCT_SPECIFICATION_MODEL_NAME,
      SELECT_PRODUCT_SPECIFICATION_SCHEMA
    );

    this.radioProductSpecificationModel = this.initDiscriminator(
      this.specificationModel,
      RADIO_PRODUCT_SPECIFICATION_MODEL_NAME,
      RADIO_PRODUCT_SPECIFICATION_SCHEMA
    );

    this.rangeProductSpecificationModel = this.initDiscriminator(
      this.specificationModel,
      RANGE_PRODUCT_SPECIFICATION_MODEL_NAME,
      RANGE_PRODUCT_SPECIFICATION_SCHEMA
    );
  }

  public generateDocument(specification: IProductSpecification): MongooseModelDocument<IProductSpecificationSchema> {
    switch (specification.type) {
      case SpecificationType.Radio:
        return new this.radioProductSpecificationModel(specification);
      case SpecificationType.Range:
        return new this.rangeProductSpecificationModel(specification);
      case SpecificationType.Select:
        return new this.selectProductSpecificationModel(specification);
      default:
        throw new DatabaseException(`Unknown specification`);
    }
  }

  public update(
    specificationModelDocument: MongooseModelDocument<IProductSpecificationSchema>,
    specification: IProductSpecification
  ): MongooseModelDocument<IProductSpecificationSchema> {
    specificationModelDocument.overwrite(specification as any);

    return specificationModelDocument;
  }
}
