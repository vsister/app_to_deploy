import mongoose from 'mongoose';
import { ProductDAO } from 'daos/ProductDAO/ProductDAO';
import { IProductSchema } from 'daos/ProductDAO/schemas';
import { MongooseModelDocument } from 'daos/DAO';
import { UserDAO } from 'daos/UserDAO/UserDAO';
import { CategoryService } from 'services/Category/CategoryService';
import { DatabaseException } from 'utils/exception/DatabaseException';
import { CategoryDAO } from 'daos/CategoryDAO/CategoryDAO';
import { ISubcategorySchema } from 'daos/CategoryDAO/schemas';
import { Service } from 'services/Service';
import {
  ReqCreate,
  ResCreate,
  ReqUpdate,
  ResUpdate,
  ReqDelete,
  ReqGetOne,
  ResGetOne,
  ResSearchByName,
} from 'shared/transactions/product';
import { ISubcategory } from 'shared/entities/Category';
import { IProduct } from 'shared/entities/Product';
import {
  IProductSpecification,
  IRangeProductSpecification,
  IRadioProductSpecification,
  ISelectProductSpecification,
  IRangeCategorySpecification,
  IRadioCategorySpecification,
  ISelectCategorySpecification,
  IRangeFilter,
  IFilter,
  RangeValue,
  SpecificationType,
} from 'shared/entities/Specification';
import { ValidationException } from 'utils/exception/ValidationException';
import { ProductSpecificationDAO } from 'daos/SpecificationDAO/ProductSpecificationDAO';

export class ProductService extends Service {
  protected productDAO = new ProductDAO();
  protected userDAO = new UserDAO();
  protected categoryDAO = new CategoryDAO();
  protected productSpecificationDAO = new ProductSpecificationDAO();

  public constructor(protected categoryService: CategoryService) {
    super();
  }

  public async create(
    groupId: string,
    parentId: string,
    subcategoryId: string,
    payload: ReqCreate
  ): Promise<ResCreate> {
    const group = await this.categoryService.getOne({ _id: groupId });
    const parentCategory = await this.categoryService.getOne({ _id: parentId });
    const subcategory = (await this.categoryService.getOne({ _id: subcategoryId })) as ISubcategory;

    const breadcrumbs = [
      {
        _id: groupId,
        name: group.name,
      },
      {
        _id: parentId,
        name: parentCategory.name,
      },
      {
        _id: subcategoryId,
        name: subcategory.name,
      },
    ] as any;

    const price = {
      _id: subcategory.priceRange.id,
      name: subcategory.priceRange.name,
      type: subcategory.priceRange.type,
      rangeValue: {
        unit: subcategory.priceRange.range.unit,
        _id: subcategory.priceRange.range._id,
        value: payload.price,
      } as RangeValue<string> & { _id: string },
    } as any;

    const { range } = subcategory.priceRange;

    if (range.minValue === 0) {
      subcategory.priceRange.range.minValue = payload.price;
    }

    if (range.minValue > payload.price) {
      subcategory.priceRange.range.minValue = payload.price;
    }

    if (range.maxValue < payload.price) {
      subcategory.priceRange.range.maxValue = payload.price;
    }

    const specifications = payload.specifications.map(payloadSpecification => {
      const subcategorySpecification = subcategory.specifications.find(
        subcategorySpec => subcategorySpec.id.toString() === payloadSpecification.id.toString()
      );

      if (!subcategorySpecification) {
        throw new ValidationException(
          `product specification (${payloadSpecification.id}) was not found in subcategory ${subcategory.id} specifications).`
        );
      }

      switch (payloadSpecification.type) {
        case SpecificationType.Radio: {
          const { value } = payloadSpecification;
          const { values } = subcategorySpecification as IRadioCategorySpecification;

          const subcategorySpecificationValue = values.find(
            specValue => specValue._id.toString() === value._id.toString()
          );

          if (!subcategorySpecificationValue) {
            throw new ValidationException(
              `product radio specification value ${
                (value._id, value.value)
              } does not exist in subcategory radio specification`
            );
          }

          return {
            _id: subcategorySpecification.id,
            name: subcategorySpecification.name,
            type: subcategorySpecification.type,
            value: subcategorySpecificationValue,
          } as Omit<IRadioProductSpecification, 'id'> & { _id: string };
        }
        case SpecificationType.Range: {
          const { value } = payloadSpecification.rangeValue;
          const { _id, unit, maxValue, minValue } = (subcategorySpecification as IRangeCategorySpecification<
            any
          >).range;

          if (value > maxValue) {
            throw new ValidationException(
              `product range specification value ${value} is greater than the subcategory specification range max value`
            );
          }

          if (value < minValue) {
            throw new ValidationException(
              `product range specification value ${value} is smaller than the subcategory specification range min value`
            );
          }

          return {
            _id: subcategorySpecification.id,
            name: subcategorySpecification.name,
            type: subcategorySpecification.type,
            rangeValue: {
              _id,
              value,
              unit,
            },
          } as Omit<IRangeProductSpecification<unknown>, 'id'> & { _id: string };
        }
        case SpecificationType.Select: {
          const { values } = payloadSpecification;
          const { values: specValues } = subcategorySpecification as ISelectCategorySpecification;

          const subcategorySpecificationValues = specValues.filter(specValue => {
            let isFound = false;

            values.forEach(value => {
              if (value._id.toString() === specValue._id.toString()) {
                isFound = true;
              }
            });

            return isFound;
          });

          if (!subcategorySpecificationValues || subcategorySpecificationValues.length === 0) {
            throw new ValidationException(
              'product select specification values do not belong to category select specification values'
            );
          }

          return {
            _id: subcategorySpecification.id,
            name: subcategorySpecification.name,
            type: subcategorySpecification.type,
            values: subcategorySpecificationValues,
          } as Omit<ISelectProductSpecification, 'id'> & { _id: string };
        }
        default:
          throw new ValidationException(`unknown specification type.`);
      }
    }) as any;

    const document = await this.productDAO.create({
      ...payload,
      breadcrumbs,
      specifications,
      price,
      requiresVerification: false,
    });

    const { products } = await this.categoryService.getSubcategoryProducts(subcategoryId);

    const product = await this.getProductEntityFromDocument(document);

    this.categoryService.update(subcategoryId, {
      priceRange: {
        ...subcategory.priceRange,
        _id: subcategory.priceRange.id,
      },
      products: [...products.map(_product => _product.id), product.id],
    } as any);

    return product;
  }

  public async update(id: string, payload: ReqUpdate): Promise<ResUpdate> {
    const newPayload: any = { ...payload };

    if (payload.specifications) {
      newPayload.specifications = payload.specifications.map(specification => {
        switch (specification.type) {
          case SpecificationType.Radio:
            return this.productSpecificationDAO.generateDocument({
              _id: specification.id,
              name: specification.name,
              type: specification.type,
              value: specification.value,
            } as any);
          case SpecificationType.Range:
            return this.productSpecificationDAO.generateDocument({
              _id: specification.id,
              name: specification.name,
              type: specification.type,
              rangeValue: specification.rangeValue,
            } as any);
          case SpecificationType.Select:
            return this.productSpecificationDAO.generateDocument({
              _id: specification.id,
              name: specification.name,
              type: specification.type,
              values: specification.values,
            } as any);
          default:
            throw new ValidationException('unknown specification type');
        }
      });
    }

    if (payload.price) {
      newPayload.price = this.productSpecificationDAO.generateDocument({
        _id: payload.price.id,
        name: payload.price.name,
        type: payload.price.type,
        rangeValue: payload.price.rangeValue,
      } as any);
    }

    const document = await this.productDAO.updateOne(id, newPayload, true);
    const product = await this.getProductEntityFromDocument(document);

    return product;
  }

  public async delete(payload: ReqDelete): Promise<void> {
    const { categoryId, productId } = payload;

    const productCategory = (await this.categoryDAO.getOne(categoryId)) as MongooseModelDocument<ISubcategorySchema>;

    const categoryProductIds = productCategory.products.map(productId => productId.toHexString());

    if (!categoryProductIds.includes(productId)) {
      throw new ValidationException(`product ${productId} does not belong to category ${categoryId}`);
    }

    const newCategoryProductIds = categoryProductIds.filter(_productId => _productId !== productId);

    await this.categoryDAO.updateOne(categoryId, { products: newCategoryProductIds } as Partial<ISubcategorySchema> & {
      products: string[];
    });

    await this.productDAO.deleteOne(productId);
  }

  public async getOne(payload: ReqGetOne): Promise<ResGetOne> {
    const document = await this.productDAO.getOne(payload._id);
    const product = await this.getProductEntityFromDocument(document);

    return product;
  }

  public async searchByName(name: string): Promise<ResSearchByName> {
    const documents = await this.productDAO.searchByName(name);
    const products = await Promise.all(documents.map(document => this.getProductEntityFromDocument(document)));

    return products;
  }

  public async getAll(): Promise<IProduct[]> {
    const documents = await this.productDAO.getAll();

    const products = await Promise.all(documents.map(document => this.getProductEntityFromDocument(document)));

    return products;
  }

  public async getMany(
    productIds: (mongoose.Types.ObjectId | string)[],
    price: IRangeFilter | null,
    specificationFilters: IFilter[]
  ): Promise<IProduct[]> {
    const productDocuments = await this.productDAO.getFiltered(productIds, price, specificationFilters);

    const products = await Promise.all(productDocuments.map(document => this.getProductEntityFromDocument(document)));

    return products;
  }

  // TODO: add filters
  public async getCount(): Promise<number> {
    const count = await this.productDAO.getCount();

    return count;
  }

  private async getProductEntityFromDocument(document: MongooseModelDocument<IProductSchema>): Promise<IProduct> {
    let expert: any = null;
    if (document.verifiedById) {
      const authorDocument = await this.userDAO.getOneById(document.verifiedById);
      expert = authorDocument
        ? {
            _id: authorDocument._id,
            username: authorDocument.username,
            name: authorDocument.name,
            role: authorDocument.role,
          }
        : null;
    }

    const product: IProduct = {
      breadcrumbs: document.breadcrumbs.map(breadcrumb => ({
        id: breadcrumb._id as any,
        name: breadcrumb.name,
      })),
      id: document.id,
      name: document.name,
      verifiedBy: expert,
      requiresVerification: document.requiresVerification,
      price: {
        id: document.price.id,
        name: document.price.name,
        type: document.price.type,
        rangeValue: document.price.rangeValue,
      },
      specifications: document.specifications.map(specification => {
        switch (specification.type) {
          case SpecificationType.Radio:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              value: specification.value,
            } as IRadioProductSpecification;
          case SpecificationType.Range:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              rangeValue: specification.rangeValue,
            } as IRangeProductSpecification<any>;
          case SpecificationType.Select:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              values: specification.values,
            } as ISelectProductSpecification;
          default:
            throw new DatabaseException(`product specification type is unknown`);
        }
      }) as IProductSpecification[],
    };

    return product;
  }
}
