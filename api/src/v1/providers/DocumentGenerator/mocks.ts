import { IOrder, OrderStatus } from 'shared/entities/Order';
import { IQuantifiableProduct } from 'shared/entities/Product';
import { IUser, UserRole } from 'shared/entities/User';
import { IRadioProductSpecification, SpecificationType } from 'shared/entities/Specification';

const currentUser: IUser = {
  username: 'Ivan111',
  name: 'Иванов Иван Иванович',
  role: UserRole.Purchaser,
};

const product1spec1: IRadioProductSpecification = {
  id: '11',
  name: 'Проекционная технология',
  type: SpecificationType.Radio,
  value: {
    _id: '11',
    value: '3LCD Технология',
  },
};

const product1spec2: IRadioProductSpecification = {
  id: '12',
  name: 'Родное разрешение',
  type: SpecificationType.Radio,
  value: {
    _id: '12',
    value: '1280 x 800 (WXGA)',
  },
};

const product1spec3: IRadioProductSpecification = {
  id: '13',
  name: 'Яркость',
  type: SpecificationType.Radio,
  value: {
    _id: '13',
    value: '1 3700 ANSI люмен',
  },
};

const product2spec1: IRadioProductSpecification = {
  id: '21',
  name: 'Метод отображения',
  type: SpecificationType.Radio,
  value: {
    _id: '21',
    value: 'прозрачная ЖК-панель (x 3, R/G/B)',
  },
};

const product2spec2: IRadioProductSpecification = {
  id: '22',
  name: 'Количество пикселей',
  type: SpecificationType.Radio,
  value: {
    _id: '22',
    value: '1,024,000 (1280 x 800) пикселей',
  },
};

const product2spec3: IRadioProductSpecification = {
  id: '23',
  name: 'Объектив',
  type: SpecificationType.Radio,
  value: {
    _id: '23',
    value: '1,024,000 (1280 x 800) пикселей',
  },
};

const product1: Omit<IQuantifiableProduct, 'breadcrumbs' | 'categoryId'> = {
  price: {
    id: '01',
    name: 'Цена',
    type: SpecificationType.Range,
    rangeValue: {
      _id: '01',
      unit: 'руб.',
      value: 65903.12,
    },
  },
  id: '01',
  quantity: 3,
  name: 'NEC ME372W',
  requiresVerification: true,
  verifiedBy: null,
  specifications: [product1spec1, product1spec2, product1spec3],
};

const product2: Omit<IQuantifiableProduct, 'breadcrumbs' | 'categoryId'> = {
  price: {
    id: '02',
    name: 'Цена',
    type: SpecificationType.Range,
    rangeValue: {
      _id: '02',
      unit: 'руб.',
      value: 1234.12,
    },
  },
  id: '02',
  quantity: 1,
  name: 'Panasonic PT-VW 360',
  requiresVerification: true,
  verifiedBy: null,
  specifications: [product2spec1, product2spec2, product2spec3],
};

export const mockOrder: any = {
  id: '1',
  name:
    'мультимедийной техники для учебных помещений направлений математика, механика, процессы управления, физика и химия',
  author: 'Иванов Иван Иванович',
  status: OrderStatus.Pending,
  date: new Date(),
  meta: {
    orderNumber: '30-09-537',
    totalPrice: 1656745.63,
    financingSource: 'расходный план программы развития',
    deliveryAddress: 'г. Санкт-Петербург, Петергоф, Астрономическая 4 (склад СПбГУ)',
    deadline: '30 дней с момента заключения договора',
    feedbackContact: 'Иванов Иван Иванович, т. 436-65-65',
    materiallyResponsible: 'Сергеев Сергей Сергеевич, т. 89340192485',
  },
  products: [product1, product2],
};
