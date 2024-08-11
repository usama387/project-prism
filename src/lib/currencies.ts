// this array of object contains currency details

export const Currencies = [
  {
    value: "PKR",
    label: "₨ Pakistani Rupee",
    locale: "ur-PK",
  },
  {
    value: "USD",
    label: "$ Dollar",
    locale: "en-US",
  },
  {
    value: "EUR",
    label: "€ Euro",
    locale: "de-DE",
  },
  {
    value: "CNY",
    label: "¥ Chinese Yuan",
    locale: "zh-CN",
  },
];

// So, export type Currency = (typeof currencies)[0]; creates a new type Currency that represents the structure of one element in the currencies array
export type Currency = (typeof Currencies)[0];
