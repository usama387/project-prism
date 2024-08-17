import { Currencies } from "@/lib/currencies";
import { z } from "zod";

// zod schema validation for currency
export const userCurrencySchema = z.object({
  currency: z.custom((value) => {
    const found = Currencies.some((c) => c.value === value);
    if (!found) {
      throw new Error(`Invalid Currency: ${value}`);
    }
    return value;
  }),
});
