import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server"; 
import { redirect } from "next/navigation"; 

// this api is being used in HistoryPeriodSelector component
export const GET = async (request: Request) => {
  // Get the current user using Clerk
  const user = await currentUser();

  // If there's no user, redirect to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // Get the user's history periods by calling the helper function
  const periods = await getHistoryPeriods(user.id);

  // Return the periods as a JSON response
  return Response.json(periods);
};

// Define the expected type of the response from getHistoryPeriods function
export type GetHistoryPeriodsResponseType = Awaited<
  ReturnType<typeof getHistoryPeriods>
>;

// Helper function to fetch distinct years of history periods for a user
const getHistoryPeriods = async (userId: string) => {
  const result = await prisma.monthHistory.findMany({
    where: {
      userId, // Filter records by userId
    },
    select: {
      year: true, // Only select the year field
    },
    distinct: ["year"], // Get distinct years only
    orderBy: [
      {
        year: "asc", // Order the results by year in ascending order
      },
    ],
  });

  // Map the result to extract just the year values
  const years = result.map((el) => el.year);

  // If no history is found, return the current year
  if (years.length === 0) {
    return [new Date().getFullYear()];
  }

  // Return the years found in the history
  return years;
};
