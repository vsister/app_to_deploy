import { IParentCategory, ICategory, ISubcategory } from 'entities/Category';

export type ReqUpdateParent = Partial<IParentCategory> & {
  id: IParentCategory['id'];
  isParent: true;
  subcategories: string[];
};
export type ReqUpdateSubcategory = Partial<ISubcategory> & { id: ISubcategory['id'] };

export type ReqUpdate = ReqUpdateParent | ReqUpdateSubcategory;

export type ResUpdate = ICategory;
