// import {
//   ISpecification,
//   ISelectCategorySpecification,
//   IRadioCategorySpecification,
//   IRangeCategorySpecification,
//   SpecificationType,
// } from 'shared/entities/Specification';

// export function createCategorySpecfications(): ISpecification[] {
//   return [
//     {
//       name: 'Производитель',
//       type: SpecificationType.Select,
//       values: [
//         {
//           key: 'hp',
//           value: 'Hewlett-Packard',
//         },
//         {
//           key: 'lenovo',
//           value: 'Lenovo',
//         },
//         {
//           key: 'dell',
//           value: 'Dell',
//         },
//       ],
//     } as ISelectCategorySpecification,
//     {
//       name: 'Форм-фактор',
//       type: SpecificationType.Radio,
//       values: [
//         {
//           key: 'tower',
//           value: 'Башенный',
//         },
//         {
//           key: 'blade',
//           value: 'Лезвие',
//         },
//         {
//           key: 'rack',
//           value: 'На полозьях',
//         },
//       ],
//     } as IRadioCategorySpecification,
//     {
//       name: 'Слотов под накопитили',
//       type: SpecificationType.Range,
//       range: {
//         unit: 'шт.',
//         max: {
//           value: 1,
//         },
//         min: {
//           value: 60,
//         },
//       },
//     } as IRangeCategorySpecification<string>,
//   ];
// }
