import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { OverviewQuerySchema } from "../../../../../ZodSchema/overview";
import prisma from "@/lib/prisma";

export const GET = async (request: Request) => {
  // getting current user details from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  //   extracting searchParams from request
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  //   passing search params into zod schema validator
  const queryParams = OverviewQuerySchema.safeParse({
    from,
    to,
  });

  if (!queryParams.success) {
    throw new Error(queryParams.error.message);
  }

  //   a sub api that fetches data based on query parameters
  const stats = await getCategoriesState(
    user.id,
    queryParams.data.from,
    queryParams.data.to
  );

  return Response.json(stats);
};

export type GetCategoriesStateResponseType = Awaited<
  ReturnType<typeof getCategoriesState>
>;

const getCategoriesState = async (userId: string, from: Date, to: Date) => {
  const stats = await prisma.transaction.groupBy({
    by: ["type", "category", "categoryIcon"],
    where: {
      userId,
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
