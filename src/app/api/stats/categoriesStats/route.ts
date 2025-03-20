import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";

export const GET = async (request: Request) => {
  // Getting current user details from Clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Extracting searchParams from request
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Passing search params into Zod schema validator
  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  // Fetch category statistics for all users
  const stats = await getCategoriesState(
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
};

// Type definition for the response (unchanged)
export type GetCategoriesStateResponseType = Awaited<
  ReturnType<typeof getCategoriesState>
>;

// Updated function without userId filter
const getCategoriesState = async (from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      date: {
        gte: from,
        lte: to,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: "desc",
      },
    },
  });

  return stats;
};