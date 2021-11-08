import { object, string } from 'yup';

export const usernameValidationSchema = string()
  .strict(true)
  .required('Данное поле должно быть заполнено')
  .min(4, 'Логин должен быть не менее 4 символов')
  .trim('Логин не должен содержать предшествующих и ведущих пробелов');

export const passwordValidationSchema = string()
  .strict(true)
  .required('Данное поле должно быть заполнено')
  .min(8, 'Пароль должен быть не менее 8 символов')
  .trim('Пароль не должен содержать предшествующих и ведущих пробелов');

export const categoryNameValidationSchema = string()
  .strict(true)
  .required('Данное поле должно быть заполнено')
  .min(3, 'Название должно содержать не менее трех символов')
  .trim('Название не должно содержать предшествующих и ведущих пробелов');
