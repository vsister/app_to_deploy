// import { CategoryService } from 'services/Category/CategoryService';
// import { ISubcategory, IParentCategory } from 'shared/entities/Category';
// import { createCategorySpecfications } from './createSpecifications';
// import { ReqCreate, ReqUpdateParent } from 'shared/transactions/category';

// export async function fillCategory(): Promise<void> {
//   const categoryService = new CategoryService();

//   const parentCategory = {
//     name: 'Сеть',
//     isParent: true,
//     subcategories: [],
//   } as ReqCreate;

//   const newParentCategory = (await categoryService.create(parentCategory)) as IParentCategory;

//   const subcategory1 = {
//     name: 'Серверы',
//     isParent: false,
//     priceRange: {
//       name: 'Цена',
//       range: {
//         unit: 'руб.',
//         max: {
//           value: 0,
//         },
//         min: {
//           value: 1000,
//         },
//       },
//     },
//     specifications: createCategorySpecfications(),
//   } as ReqCreate;

//   const newSubcategory = await categoryService.create(subcategory1);

//   await categoryService.update({
//     id: newParentCategory.id,
//     subcategories: [...newParentCategory.subcategories, newSubcategory.id],
//   } as ReqUpdateParent);
// }
