import { ICategory, ICategoryGroup, IParentCategory, ISubcategory } from 'entities/Category';
import { IRangeCategorySpecification } from 'entities/Specification';

export type ReqCreateGroup = Omit<ICategoryGroup, 'id'>;
export type ReqCreateParent = Omit<IParentCategory, 'id'> & {
  groupId: string;
};

export type ReqCreateSubcategory = Omit<ISubcategory, 'id' | 'priceRange'> & {
  parentId: string;
  priceRange: Omit<IRangeCategorySpecification<string>, '_id'>;
};

export type ReqCreate = ReqCreateParent | ReqCreateSubcategory | ReqCreateGroup;

export type ResCreate = ICategory;
