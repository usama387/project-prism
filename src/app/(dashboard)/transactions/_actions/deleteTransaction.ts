"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const deleteTransaction = async (id: string) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!transaction) {
    throw new Error("Transaction doesn't exist");
  }

  return await prisma.$transaction([
    // delete transaction from db
    prisma.transaction.delete({
      where: {
        id,
        userId: user.id,
      },
    }),

    // update month history table to exclude this transaction
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: transaction.date.getUTCDate(),
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },

      //   for data from this transaction can either be expense or income and needs to be removed from the table
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),

        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),

    // update year history table to exclude this transaction
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: transaction.date.getUTCMonth(),
          year: transaction.date.getUTCFullYear(),
        },
      },

      //   for data from this transaction can either be expense or income and needs to be removed from the table
      data: {
        ...(transaction.type === "expense" && {
          expense: {
            decrement: transaction.amount,
          },
        }),

        ...(transaction.type === "income" && {
          income: {
            decrement: transaction.amount,
          },
        }),
      },
    }),
  ]);
};
