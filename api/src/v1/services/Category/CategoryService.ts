import mongoose from 'mongoose';
import { CategoryDAO } from 'daos/CategoryDAO/CategoryDAO';
import {
  ICategoryGroupSchema,
  ICategorySchema,
  IParentCategorySchema,
  ISubcategorySchema,
} from 'daos/CategoryDAO/schemas';
import { MongooseModelDocument } from 'daos/DAO';
import { UserDAO } from 'daos/UserDAO/UserDAO';
import { ProductService } from 'services/Product/ProductService';
import { DatabaseException } from 'utils/exception/DatabaseException';
import {
  ICategorySpecificationSchema,
  IProductSpecificationSchema,
  IRadioCategorySpecificationSchema,
  IRadioProductSpecificaitonSchema,
  IRangeCategorySpecificationSchema,
  IRangeProductSpecificaitonSchema,
  ISelectCategorySpecificationSchema,
  ISelectProductSpecificaitonSchema,
} from 'daos/SpecificationDAO/schemas';
import { CategorySpecificationDAO } from 'daos/SpecificationDAO/CategorySpecificationDAO';
import { ProductDAO } from 'daos/ProductDAO/ProductDAO';
import { ProductSpecificationDAO } from 'daos/SpecificationDAO/ProductSpecificationDAO';
import { IBreadcrumbSchema, IProductSchema } from 'daos/ProductDAO/schemas';
import { Service } from 'services/Service';
import { Exception, ExceptionType } from 'utils/exception/Exception';
import { CategoryType, ICategoryGroup, IParentCategory, ISubcategory } from 'shared/entities/Category';
import { IProduct } from 'shared/entities/Product';
import {
  IRangeCategorySpecification,
  IRadioCategorySpecification,
  ISelectCategorySpecification,
  ICategorySpecification,
  IFilter,
  IRangeFilter,
  SpecificationType,
  SelectValue,
} from 'shared/entities/Specification';
import {
  ReqUpdate,
  ResUpdate,
  ReqDelete,
  ResGetParentCategories,
  ResGetSubcategoryProducts,
  ResGetCategoryGroups,
  ReqGetOne,
  ResGetOne,
  ReqCreateGroup,
  ReqCreateParent,
  ReqCreateSubcategory,
  ReqUpdateSubcategory,
} from 'shared/transactions/category';
import { ValidationException } from 'utils/exception/ValidationException';
import { SpecificationDAO } from 'daos/SpecificationDAO/SpecificationDAO';

export class CategoryService extends Service {
  protected productService: ProductService;
  protected categoryDAO = new CategoryDAO();
  protected productDAO = new ProductDAO();
  protected userDAO = new UserDAO();
  protected categorySpecificationDAO = new CategorySpecificationDAO();
  protected productSpecificationDAO = new ProductSpecificationDAO();

  public constructor() {
    super();
  }

  public setProductService(service: ProductService): void {
    this.productService = service;
  }

  public async createCategoryGroup(payload: ICategoryGroup): Promise<ICategoryGroup> {
    const newGroupDocument = await this.categoryDAO.create(payload as ReqCreateGroup);

    const categoryGroup = await this.getCategoryGroupEntityFromDocument(
      newGroupDocument as MongooseModelDocument<ICategoryGroupSchema>
    );

    return categoryGroup;
  }

  public async createParentCategory(payload: ReqCreateParent): Promise<IParentCategory> {
    const categoryGroup = (await this.categoryDAO.getOne(payload.groupId)) as MongooseModelDocument<
      ICategoryGroupSchema
    >;

    const parentCategoryDocument = await this.categoryDAO.create(payload);
    const parentCategory = await this.getParentCategoryEntityFromDocument(
      parentCategoryDocument as MongooseModelDocument<IParentCategorySchema>
    );

    const groupCategories = [...categoryGroup.categories, parentCategory.id];

    await this.categoryDAO.updateOne(payload.groupId, { categories: groupCategories } as Partial<ICategoryGroupSchema>);

    return parentCategory;
  }

  public async createSubcategory(payload: ReqCreateSubcategory): Promise<ISubcategory> {
    const parentCategory = (await this.categoryDAO.getOne(payload.parentId)) as MongooseModelDocument<
      IParentCategorySchema
    >;

    const priceRange: IRangeCategorySpecification<string> = {
      type: SpecificationType.Range,
      name: 'Цена',
      range: {
        unit: 'руб.',
        minValue: 0,
        maxValue: 0,
      },
    } as Omit<IRangeCategorySpecification<string>, '_id'>;

    const newSubcategoryDocument = (await this.categoryDAO.create({ ...payload, priceRange })) as MongooseModelDocument<
      ISubcategorySchema
    >;

    const subcategory = await this.getSubcategoryEntityFromModel(newSubcategoryDocument);

    const parentSubcategories = [...parentCategory.subcategories, subcategory.id];

    await this.categoryDAO.updateOne(payload.parentId, { subcategories: parentSubcategories } as Partial<
      IParentCategorySchema
    >);

    return subcategory;
  }

  public async getOne(payload: ReqGetOne): Promise<ResGetOne> {
    const categoryDocument = await this.categoryDAO.getOne(payload._id);

    switch (categoryDocument.type) {
      case CategoryType.Group: {
        const categoryGroup = await this.getCategoryGroupEntityFromDocument(
          categoryDocument as MongooseModelDocument<ICategoryGroupSchema>
        );

        return categoryGroup;
      }
      case CategoryType.Parent: {
        const parentCategory = await this.getParentCategoryEntityFromDocument(
          categoryDocument as MongooseModelDocument<IParentCategorySchema>
        );

        return parentCategory;
      }
      case CategoryType.Subcategory: {
        const subcategory = await this.getSubcategoryEntityFromModel(
          categoryDocument as MongooseModelDocument<ISubcategorySchema>
        );

        return subcategory;
      }
      default:
        throw new DatabaseException(`unknown category type for category ${categoryDocument._id}`);
    }
  }

  public async getCategoryGroups(): Promise<ResGetCategoryGroups> {
    const documents = await this.categoryDAO.getCategoryGroups();
    const groups = await Promise.all(documents.map(document => this.getCategoryGroupEntityFromDocument(document)));

    return { groups };
  }

  public async getParentCategories(): Promise<ResGetParentCategories> {
    const documents = await this.categoryDAO.getParentCategories();
    const categories = await Promise.all(documents.map(document => this.getParentCategoryEntityFromDocument(document)));

    return { categories };
  }

  public async getSubcategoryProducts(
    id: string,
    page?: number,
    limit?: number,
    filters?: {
      price?: IRangeFilter;
      specifications?: IFilter[];
    } | null
  ): Promise<ResGetSubcategoryProducts> {
    const document = await this.categoryDAO.getOne(id);

    if (document.type !== CategoryType.Subcategory) {
      throw new Exception(ExceptionType.ValidationFailed, `Given category id (${id}) is not belong to subcategory`);
    }

    // eslint-disable-next-line no-extra-parens
    const productIds = (document as MongooseModelDocument<ISubcategorySchema>).products;

    let products = await this.productService.getMany(
      productIds,
      filters && filters.price ? filters.price : null,
      filters && filters.specifications ? filters.specifications : []
    );

    const productCount = products.length;

    if (page || limit) {
      const fixedPage = page || 0;
      const fixedLimit = limit || 10;

      products = products.slice(fixedPage * fixedLimit, fixedPage * fixedLimit + fixedLimit);
    }

    return {
      products,
      totalCount: productCount,
    };
  }

  public async getSubcategoryParent(subcategory: ISubcategory): Promise<IParentCategory> {
    const document = await this.categoryDAO.getOne(subcategory.id);
    const parentDocument = await this.categoryDAO.getOne(
      (document as MongooseModelDocument<ISubcategorySchema>).parentId
    );

    const category = await this.getParentCategoryEntityFromDocument(
      parentDocument as MongooseModelDocument<IParentCategorySchema>
    );

    return category;
  }

  public async getCategoryGroup(parentCategory: IParentCategory): Promise<ICategoryGroup> {
    const parentDocument = await this.categoryDAO.getOne(parentCategory.id);
    const groupDocument = await this.categoryDAO.getOne(
      (parentDocument as MongooseModelDocument<IParentCategorySchema>).groupId
    );

    const categoryGroup = await this.getCategoryGroupEntityFromDocument(
      groupDocument as MongooseModelDocument<ICategoryGroupSchema>
    );

    return categoryGroup;
  }

  public async update(id: string, payload: ReqUpdate): Promise<ResUpdate> {
    const documentToUpdate = await this.categoryDAO.getOne(id);

    if (documentToUpdate.type === CategoryType.Subcategory) {
      const payloadSpecifications = (payload as ReqUpdateSubcategory).specifications;

      if (payloadSpecifications) {
        (payload as ReqUpdateSubcategory).specifications = await Promise.all(
          payloadSpecifications.map(async categorySpecificationToUpdate => {
            const regeneratedSpecificationDocument = this.categorySpecificationDAO.generateDocument({
              _id: categorySpecificationToUpdate.id,
              ...categorySpecificationToUpdate,
            } as ICategorySpecification & { _id: string });

            return {
              ...regeneratedSpecificationDocument,
              _id: categorySpecificationToUpdate.id,
            } as ICategorySpecificationSchema;
          })
        );

        const subcategoryProducts = await this.getSubcategoryProducts(id);

        subcategoryProducts.products.forEach(async subcategoryProduct => {
          const updatedProductSpecifications = subcategoryProduct.specifications.flatMap(
            productSpecificationToUpdate => {
              const updatedCategorySpecification = payloadSpecifications.find(
                categorySpecification =>
                  categorySpecification.id.toString() === productSpecificationToUpdate.id.toString()
              );

              if (!updatedCategorySpecification) {
                return [];
              }

              switch (productSpecificationToUpdate.type) {
                case SpecificationType.Radio: {
                  const updatedSpecificationValue = (updatedCategorySpecification as IRadioCategorySpecification).values.find(
                    categorySpecificationValue => {
                      console.log(categorySpecificationValue._id.toString(), productSpecificationToUpdate.value._id);
                      return (
                        categorySpecificationValue._id.toString() === productSpecificationToUpdate.value._id.toString()
                      );
                    }
                  );

                  if (!updatedSpecificationValue) {
                    return [];
                  }

                  return {
                    _id: updatedCategorySpecification.id,
                    name: updatedCategorySpecification.name,
                    type: updatedCategorySpecification.type,
                    value: {
                      _id: updatedSpecificationValue._id,
                      value: updatedSpecificationValue.value,
                    },
                  } as IRadioProductSpecificaitonSchema;
                }
                case SpecificationType.Range: {
                  const { range } = updatedCategorySpecification as IRangeCategorySpecification<any>;
                  const { value, unit } = productSpecificationToUpdate.rangeValue;

                  if (value > range.maxValue || value < range.minValue) {
                    return [];
                  }

                  return {
                    _id: updatedCategorySpecification.id,
                    name: updatedCategorySpecification.name,
                    type: updatedCategorySpecification.type,
                    rangeValue: {
                      _id: range._id,
                      value,
                      unit,
                    },
                  } as IRangeProductSpecificaitonSchema;
                }
                case SpecificationType.Select: {
                  const { values: specValues } = updatedCategorySpecification as ISelectCategorySpecification;
                  const { values } = productSpecificationToUpdate.values;

                  const newValues = productSpecificationToUpdate.values.flatMap(productSpecificationValue => {
                    const specValue = specValues.find(
                      specValue => specValue._id.toString() === productSpecificationValue._id.toString()
                    );

                    if (!specValue) {
                      return [];
                    }

                    return {
                      _id: specValue._id,
                      value: specValue.value,
                    } as SelectValue;
                  });

                  if (!newValues.length) {
                    return [];
                  }

                  return {
                    _id: updatedCategorySpecification.id,
                    name: updatedCategorySpecification.name,
                    type: updatedCategorySpecification.type,
                    values: newValues,
                  } as ISelectProductSpecificaitonSchema;
                }
                default:
                  throw new DatabaseException('unknown product specification type');
              }
            }
          );

          await this.productDAO.updateOne(
            subcategoryProduct.id,
            {
              specifications: updatedProductSpecifications.map(updatedProductSpecification =>
                this.productSpecificationDAO.generateDocument(updatedProductSpecification)
              ),
            },
            true
          );
        });
      }
    }

    const document = await this.categoryDAO.updateOne(id, {
      ...payload,
      _id: id as any,
    } as Partial<ICategorySchema>);

    switch (document.type) {
      case CategoryType.Group: {
        const categoryGroup = await this.getCategoryGroupEntityFromDocument(
          document as MongooseModelDocument<ICategoryGroupSchema>
        );
        return categoryGroup;
      }
      case CategoryType.Parent: {
        const parentCategory = await this.getParentCategoryEntityFromDocument(
          document as MongooseModelDocument<IParentCategorySchema>
        );
        return parentCategory;
      }
      case CategoryType.Subcategory: {
        const subcategory = await this.getSubcategoryEntityFromModel(
          document as MongooseModelDocument<ISubcategorySchema>
        );
        return subcategory;
      }
      default:
        throw new DatabaseException('');
    }
  }

  public async delete(payload: ReqDelete): Promise<void> {
    const { _id } = payload;

    const categoryToDelete = (await this.categoryDAO.getOne(_id)) as
      | MongooseModelDocument<ICategoryGroupSchema>
      | MongooseModelDocument<IParentCategorySchema>
      | MongooseModelDocument<ISubcategorySchema>;

    switch (categoryToDelete.type) {
      case CategoryType.Group:
        categoryToDelete.categories.forEach(async category => this.delete({ _id: category }));
        break;
      case CategoryType.Parent: {
        categoryToDelete.subcategories.forEach(async subcategory => this.delete({ _id: subcategory }));
        const group = (await this.categoryDAO.getOne(categoryToDelete.groupId)) as MongooseModelDocument<
          ICategoryGroupSchema
        >;
        const newGroupCategories = group.categories.filter(
          category => category.toHexString() !== mongoose.Types.ObjectId(categoryToDelete._id).toHexString()
        );
        await this.categoryDAO.updateOne(categoryToDelete.groupId, {
          categories: newGroupCategories,
        } as Partial<ICategoryGroupSchema>);
        break;
      }
      case CategoryType.Subcategory: {
        const parentCategory = (await this.categoryDAO.getOne(categoryToDelete.parentId)) as MongooseModelDocument<
          IParentCategorySchema
        >;

        const newParentCategorySubcategories = parentCategory.subcategories.filter(
          subcategory => subcategory.toHexString() !== mongoose.Types.ObjectId(categoryToDelete._id).toHexString()
        );

        await this.categoryDAO.updateOne(categoryToDelete.parentId, {
          subcategories: newParentCategorySubcategories,
        } as Partial<IParentCategorySchema>);

        const subcategoryProducts = await this.getSubcategoryProducts(categoryToDelete.id);

        await Promise.all(
          subcategoryProducts.products.map(product =>
            this.productService.delete({ categoryId: categoryToDelete.id, productId: product.id })
          )
        );

        break;
      }
      default:
        throw new DatabaseException('unknown specification type');
    }

    await this.categoryDAO.deleteOne(_id);
  }

  private async getCategoryGroupEntityFromDocument(
    categoryGroupDocument: MongooseModelDocument<ICategoryGroupSchema>
  ): Promise<ICategoryGroup> {
    const categories = (await Promise.all(
      categoryGroupDocument.categories.map(id => this.getOne({ _id: id }))
    )) as IParentCategory[];

    categoryGroupDocument;

    const categoryGroup: ICategoryGroup = {
      categories,
      id: categoryGroupDocument.id,
      type: categoryGroupDocument.type,
      name: categoryGroupDocument.name,
    };

    return categoryGroup;
  }

  private async getParentCategoryEntityFromDocument(
    parentCategoryDocument: MongooseModelDocument<IParentCategorySchema>
  ): Promise<IParentCategory> {
    const subcategories = (await Promise.all(
      parentCategoryDocument.subcategories.map(id => this.getOne({ _id: id }))
    )) as ISubcategory[];

    const parentCategory: IParentCategory = {
      id: parentCategoryDocument.id,
      type: parentCategoryDocument.type,
      subcategories,
      name: parentCategoryDocument.name,
    };

    return parentCategory;
  }

  private async getSubcategoryEntityFromModel(
    subcategoryDocument: MongooseModelDocument<ISubcategorySchema>
  ): Promise<ISubcategory> {
    const subcategory: ISubcategory = {
      id: subcategoryDocument.id,
      type: subcategoryDocument.type,
      priceRange: {
        id: subcategoryDocument.priceRange._id,
        type: subcategoryDocument.priceRange.type,
        name: subcategoryDocument.priceRange.name,
        range: subcategoryDocument.priceRange.range,
      } as IRangeCategorySpecification<string> & { id: string },
      specifications: subcategoryDocument.specifications.map(specification => {
        switch (specification.type) {
          case SpecificationType.Radio:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              values: specification.values,
            };
          case SpecificationType.Range:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              range: specification.range,
            };
          case SpecificationType.Select:
            return {
              id: specification._id,
              name: specification.name,
              type: specification.type,
              values: specification.values,
            };
          default:
            throw new DatabaseException(`subcategory (id: ${subcategoryDocument.id}) specification type in unknown`);
        }
      }) as ICategorySpecification[],
      name: subcategoryDocument.name,
    };

    return subcategory;
  }
}
