import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";
import { GetFormatterForCurrency } from "@/lib/helpers";

// this api is being fetched transaction table component to get transaction history and its data
export const GET = async (request: Request) => {
  //  getting user from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //   lets destructure the searchParams from from request url to pass it in the request using new URL method
  const { searchParams } = new URL(request.url);

  //   accessing parameters with get method of searchParams
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  //   validating parameters with zod schema safeParse method
  const QueryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!QueryParams.success) {
    return Response.json(QueryParams.error.message, {
      status: 500,
    });
  }

  //   getTransactionHistory is a sub function of this api which accepts userId from clerk and to and from as parameters to return transactions history based on the range
  const transactions = await getTransactionHistory(
    user.id,
    QueryParams.data.from,
    QueryParams.data.to
  );

  return Response.json(transactions);
};

// exporting the type of downward function
export type getTransactionHistoryResponseType = Awaited<
  ReturnType<typeof getTransactionHistory>
>;

const getTransactionHistory = async (userId: string, from: Date, to: Date) => {
  // accessing currency details through userSettings table in db
  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId,
    },
  });

  if (!userSettings) {
    throw new Error("User settings not found");
  }

  //   passing user currency
  const formatter = GetFormatterForCurrency(userSettings.currency);

  //   fetching transactions now
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  //   mapping through the transactions and then spreading it to extract and format amount with user currency
  return transactions.map((transaction) => ({
    ...transaction,

    // formatting the amount with user currency
    formattedAmount: formatter.format(transaction.amount),
  }));
};
