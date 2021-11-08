import {
  Document,
  TabStopType,
  TabStopPosition,
  TextRun,
  Table,
  TableCell,
  TableRow,
  VerticalAlign,
  Packer,
  Paragraph,
  AlignmentType,
} from 'docx';
import { mockOrder } from './mocks';
import { IOrder } from 'shared/entities/Order';
import { IQuantifiableProduct } from 'shared/entities/Product';
import {
  IRadioProductSpecification,
  SpecificationType,
  ISelectProductSpecification,
  IRangeProductSpecification,
} from 'shared/entities/Specification';

const renderHeader = (order: IOrder): Paragraph[] => [
  new Paragraph({
    children: [
      new TextRun({
        text: 'Управление-Служба',
        size: 24,
      }),
      new TextRun({
        text: '\tРуководителю Контрактной службы СПбГУ',
        size: 24,
      }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: 'информационных технологий',
        size: 24,
      }),
      new TextRun({
        text: '\tС.Н. Можайской',
        size: 24,
      }),
    ],
    tabStops: [
      {
        type: TabStopType.RIGHT,
        position: TabStopPosition.MAX,
      },
    ],
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: `${order.createdAt.getDate()}.${order.createdAt.getMonth()}.${order.createdAt.getFullYear()} № ${
          order.meta.orderNumber
        }`,
        size: 24,
      }),
    ],
    spacing: {
      before: 480,
      after: 280,
    },
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: 'Заявка на закупку',
        size: 24,
        bold: true,
        allCaps: true,
      }),
    ],
    alignment: AlignmentType.CENTER,
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: order.name,
        size: 24,
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: {
      after: 240,
    },
  }),
  new Paragraph({
    children: [
      new TextRun({
        text: '1)\tТаблица товаров (работ, услуг):',
        size: 24,
      }),
    ],
    spacing: {
      after: 240,
    },
  }),
];

const renderSpec = <Unit>(
  spec: IRadioProductSpecification | ISelectProductSpecification | IRangeProductSpecification<Unit>
): Paragraph => {
  switch (spec.type) {
    case SpecificationType.Radio:
      return new Paragraph({
        children: [
          new TextRun({
            text: `${spec.name}: ${spec.value.value}`,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
      });
    case SpecificationType.Range:
      return new Paragraph({
        children: [
          new TextRun({
            text: `${spec.name}: ${spec.rangeValue.value} ${spec.rangeValue.unit}`,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
      });
    case SpecificationType.Select:
      return new Paragraph({
        children: [
          new TextRun({
            text: `${spec.name}: ${spec.values.map(specValue => specValue.value).join(', ')}`,
            size: 24,
          }),
        ],
        alignment: AlignmentType.CENTER,
      });
    default:
      return new Paragraph({ children: [] });
  }
};

const renderTableRow = (product: Omit<IQuantifiableProduct, 'breadcrumbs'>, index: number): TableRow =>
  new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: (index + 1).toString(),
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: product.name,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [...product.specifications.map(spec => renderSpec(spec))],
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${product.price.rangeValue.value}`,
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: product.quantity.toString(),
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: Math.round(product.price.rangeValue.value * product.quantity).toString(),
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
        verticalAlign: VerticalAlign.CENTER,
      }),
    ],
    cantSplit: false,
  });

const tableHeader = new TableRow({
  children: [
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: '№ п/п',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Наименование (товара, работы, услуги)',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Технические характеристики',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `Цена за единицу, руб.`,
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Кол-во',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
    new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'Суммарная стоимость, руб.',
              size: 24,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }),
  ],
});

const renderTable = (order: IOrder): Table =>
  new Table({
    rows: [tableHeader, ...order.products.map((product, index) => renderTableRow(product, index))],
  });

const totalPrice = (products: IQuantifiableProduct[]): number => {
  let sum = 0;
  for (let i = 0; i < products.length; ++i) {
    sum += products[i].price.rangeValue.value * products[i].quantity;
  }
  return sum;
};

const renderFooter = (order: IOrder): Paragraph[] => {
  let total = totalPrice(order.products);
  const result = [
    new Paragraph({
      children: [
        new TextRun({
          text: `2)\tСуммарная максимальная стоимость заказа ${Math.trunc(total)} руб. ${
            total - Math.trunc(total)
          } коп.`,
          size: 24,
        }),
      ],
      spacing: {
        before: 300,
      },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `3)\tСроки (поставки товара, оказания услуг): ${order.meta.deadline}.`,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `4)\tАдрес (доставки товара, места оказания услуг): ${order.meta.deliveryAddress}.`,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `5)\tИсточник финансирования: ${order.meta.financingSource}.`,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `6)\tКонтактное лицо по заявке: ${order.meta.feedbackContact}.`,
          size: 24,
        }),
      ],
    }),
  ];
  if (order.meta.materiallyResponsible) {
    result.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `7)\tМатериально ответственное лицо: ${order.meta.materiallyResponsible}.`,
            size: 24,
          }),
        ],
      })
    );
  }
  result.push(
    new Paragraph({
      children: [
        new TextRun({
          text: 'Заместитель начальника управления',
          size: 24,
        }),
        new TextRun({
          text: '\tПутинцев А.С.',
          size: 24,
        }),
      ],
      spacing: {
        before: 720,
      },
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
        },
      ],
    })
  );
  return result;
};

export async function renderDoc(order: IOrder): Promise<string> {
  const doc = new Document();
  const header = renderHeader(order);
  const table = renderTable(order);
  const footer = renderFooter(order);

  doc.addSection({
    children: [...header, table, ...footer],
  });

  const buffer = await Packer.toBase64String(doc);

  return buffer;
}
