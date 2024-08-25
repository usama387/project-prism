import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays } from "date-fns";
import { z } from "zod";

export const OverviewQuerySchema = z
  .object({
    // Defining a schema object with two date fields: 'from' and 'to'.
    from: z.coerce.date(), // The 'from' field will be coerced to a Date object.
    to: z.coerce.date(),   // The 'to' field will also be coerced to a Date object.
  })
  .refine((args) => {
    // Adding a custom validation rule using 'refine'.
    const { from, to } = args; // Destructuring 'from' and 'to' dates from the input.

    const days = differenceInDays(to, from); // Calculating the difference in days between 'to' and 'from' dates.

    // Checking if the date range is valid: it should be non-negative (i.e., 'to' is not before 'from')
    // and should not exceed the maximum allowed days.
    const isValidRange = days >= 0 && days <= MAX_DATE_RANGE_DAYS;
    return isValidRange; // The custom validation passes if 'isValidRange' is true.
  });
