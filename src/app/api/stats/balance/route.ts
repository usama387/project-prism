import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";

// This API will return total income and expenses for all users for the selected period
export const GET = async (request: Request) => {
  // Getting user from Clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Destructuring search parameters from request URL
  const { searchParams } = new URL(request.url);

  // Accessing date range parameters from searchParams
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Validating searchParams with Zod
  const queryParams = OverviewQuerySchema.safeParse({ from, to });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 500,
    });
  }

  // Fetching stats for all users within the date range
  const stats = await getBalanceStats(
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
};

export type GetBalanceStatsResponseType = Awaited<
  ReturnType<typeof getBalanceStats>
>;

const getBalanceStats = async (from: Date, to: Date) => {
  const totals = await prisma.transaction.groupBy({
    by: ["type"],
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
  });

  return {
    expense: totals.find((t) => t.type === "expense")?._sum.amount || 0,
    income: totals.find((t) => t.type === "income")?._sum.amount || 0,
  };
};