import { ICategorySpecification, IRangeCategorySpecification } from '../Specification';

export enum CategoryType {
  Group = 'CategoryGroup',
  Parent = 'ParentCategory',
  Subcategory = 'Subcategory',
}
export interface IBaseCategory {
  id: string;
  name: string;
  type: CategoryType;
}

export interface ICategoryGroup extends IBaseCategory {
  type: CategoryType.Group;
  categories: IParentCategory[];
}

export interface IParentCategory extends IBaseCategory {
  type: CategoryType.Parent;
  subcategories: ISubcategory[];
}

export interface ISubcategory extends IBaseCategory {
  type: CategoryType.Subcategory;
  priceRange: IRangeCategorySpecification<string>;
  specifications: ICategorySpecification[];
}

export type ICategory = ICategoryGroup | IParentCategory | ISubcategory;
