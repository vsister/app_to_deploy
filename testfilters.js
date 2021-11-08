const filters = {
  price: {
    specificationId: '5fb96399557d52016b5c7389',
    type: 'range',
    from: 100,
    to: 100000,
  },
  specifications: [],
};

const encoded = encodeURIComponent(JSON.stringify(filters));

console.log(encoded);

console.log(JSON.parse(decodeURIComponent(encoded)));
