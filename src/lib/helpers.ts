import { Currencies } from "./currencies";

export const DateToUTCDate = (date: Date) => {
  // The function converts a given date to a UTC date (i.e., without timezone offset).
  return new Date(
    Date.UTC(
      date.getFullYear(), // Get the year from the input date.
      date.getMonth(), // Get the month (0-11) from the input date.
      date.getDate(), // Get the day of the month (1-31) from the input date.
      date.getHours(), // Get the hours (0-23) from the input date.
      date.getMinutes(), // Get the minutes (0-59) from the input date.
      date.getSeconds(), // Get the seconds (0-59) from the input date.
      date.getMilliseconds() // Get the milliseconds (0-999) from the input date.
    )
  );
};

// function to format currency
export const GetFormatterForCurrency = (currency: string) => {
  const locale = Currencies.find((c) => c.value === currency)?.locale;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
};
