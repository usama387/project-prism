import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";
import { GetFormatterForCurrency } from "@/lib/helpers";

// This API is fetched by the transaction table component to get transaction history and its data
export const GET = async (request: Request) => {
  // Getting user from Clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Destructure the searchParams from the request URL
  const { searchParams } = new URL(request.url);

  // Accessing parameters with get method of searchParams
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Validating parameters with Zod schema safeParse method
  const QueryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!QueryParams.success) {
    return Response.json(QueryParams.error.message, {
      status: 500,
    });
  }

  // Get transaction history without filtering by userId
  const transactions = await getTransactionHistory(
    user.id,
    QueryParams.data.from,
    QueryParams.data.to
  );

  return Response.json(transactions);
};

// Exporting the type of the getTransactionHistory function
export type getTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionHistory>
>;

const getTransactionHistory = async (userId: string, from: Date, to: Date) => {
  // Accessing currency details through userSettings table in db for the authenticated user
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  // Passing user currency to the formatter
  const formatter = GetFormatterForCurrency(userSettings.currency);

  // Fetching all transactions within the date range, without filtering by userId
  const transactions = await prisma.transaction.findMany({
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  // Mapping through the transactions, spreading them, and formatting the amount with the user's currency
  return transactions.map((transaction) => ({
    ...transaction,
    formattedAmount: formatter.format(transaction.amount),
  }));
};