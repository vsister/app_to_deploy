import { ICategoryGroup, IParentCategory, ISubcategory } from 'entities/Category';

export interface ReqGetOne {
  _id: any;
}

export type ResGetOne = IParentCategory | ISubcategory | ICategoryGroup;
