import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";

// this api will return total income and balance for the selected period
export const GET = async (request: Request) => {
  // getting user from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //   destructuring search parameters from request url
  const { searchParams } = new URL(request.url);

  // accessing date from searchParams and storing it in a from which is date range variable
  const from = searchParams.get("from");

  // accessing date from searchParams and storing it in a from which is also a date range variable
  const to = searchParams.get("to");

  //   validating searchParams with zod
  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 500,
    });
  }

  //   its an helper function accepting all these properties from clerk and queryParams
  const stats = await getBalanceStats(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
};

// In summary, GetBalanceStatsResponseType will be the type (expense or income) of the data you receive when you await the result of the getBalanceStats function.
export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

// creating the upward function and taking parameters passed from there
const getBalanceStats = async (userId: string, from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      userId,
      date: {
        gte: "from",
        lte: "to",
      },
    },
    _sum: {
      amount: true,
    },
  });


  return {
    // it sums based on the type passed either expense or income
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
};
