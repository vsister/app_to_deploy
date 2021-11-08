// import { ISubcategory } from 'shared/entities/Category';
// import {
//   SpecificationType,
//   IRadioProductSpecification,
//   ISelectProductSpecification,
//   IRangeProductSpecification,
// } from 'shared/entities/Specification';
// import { IMongooseIdentifiable } from 'shared/entities/Base';
// import { IProduct } from 'shared/entities/Product';
// import { ProductService } from 'services/Product/ProductService';

// export async function fillProducts(categoryId: string): Promise<void> {
//   const categoryService = new ProductService();
//   const category = await categoryService.getOne({ _id: categoryId });

//   const productSpecifications = category.specifications.map(spec => {
//     switch (spec.type) {
//       case SpecificationType.Radio:
//         return {} as IRadioProductSpecification;
//         break;
//       case SpecificationType.Range:
//         break;
//       case SpecificationType.Select:
//         break;
//       default:
//         break;
//     }
//   });
// }
