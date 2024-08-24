"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "../../../../ZodSchema/transactions";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const createTransaction = async (form: CreateTransactionSchemaType) => {
  // lets validate the form by passing it in safeParse method
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  //   now lets get user from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //   now lets destructure the validated form data
  const { amount, description, date, category, type } = parsedBody.data;

  // now lets get a particular category from db belong to the user and its name
  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) {
    throw new Error("Category not found");
  }

  // NOTE: don't get confused between $transaction (prisma) and prisma.transaction (table)
  // The prisma.$transaction method is used to execute multiple operations as a single transaction,
  // which means either all of them succeed, or if any one fails, none are applied to the database.

  await prisma.$transaction([
    // create user transaction
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),

    // update month aggregate tables
    // Second operation: Update or insert (upsert) a record in the "monthHistory" table.
    // This operation keeps track of monthly aggregates for a specific user.
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          // utc means without timezone
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // If the record doesn't exist, create it with these values.
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // If the record already exists, update the expense and income fields.
      update: {
        // Increase the expense by the transaction amount if it's an expense
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        // Increase the income by the transaction amount if it's an expense
        income: {
          increment: type === "income" ? amount : 0,
        },
      },
    }),

    // now update year aggregate table
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          // utc means without timezone
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },

      // If the record doesn't exist, create it with these values.
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },

      // If the record already exists, update the expense and income fields.
      update: {
        // Increase the expense by the transaction amount if it's an expense
        expense: {
          increment: type === "expense" ? amount : 0,
        },
        // Increase the income by the transaction amount if it's an expense
        income: {
          increment: type === "expense" ? amount : 0,
        },
      },
    }),
  ]);
};
