"use server";

import { currentUser } from "@clerk/nextjs/server";
import { userCurrencySchema } from "../../../../ZodSchema/userSettings";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// this server action updates the currency for a specific user by taking it as a parameter from request and then passing it to the function
export const updateUserCurrency = async (currency: string) => {
  // importing zod schema created for currency validation
  const parsedBody = userCurrencySchema.safeParse({
    currency,
  });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  //   getting current user from clerk hook
  const user = await currentUser();

  //   if no user found
  if (!user) {
    redirect("/sign-in");
  }

  const userSettingsUpdate = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      userId: user.id,
      currency,
    },
  });

  return userSettingsUpdate;
};
