import prisma from "@/lib/prisma";
import { Period, TimeFrame } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for validating the incoming query parameters
const getHistoryDataSchema = z.object({
  timeFrame: z.enum(["month", "year"]), // Accepts either 'month' or 'year'
  month: z.coerce.number().min(0).max(11).default(0), // Validates month between 0 and 11 (Jan - Dec)
  year: z.coerce.number().min(2000).max(3000), // Validates year within a reasonable range
});

// Handler for GET requests
export const GET = async (request: Request) => {
  // Retrieve the currently authenticated user from Clerk
  const user = await currentUser();

  // If the user is not authenticated, redirect to sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);
  const timeFrame = searchParams.get("timeFrame"); // Timeframe can be 'month' or 'year'
  const year = searchParams.get("year"); // The year parameter
  const month = searchParams.get("month"); // The month parameter

  // Validate the query parameters using zod schema
  const queryParams = getHistoryDataSchema.safeParse({
    timeFrame,
    month,
    year,
  });

  // If validation fails, return an error response
  if (!queryParams.success) {
    return Response.json(queryParams.error.message, {
      status: 500,
    });
  }

  // Fetch history data based on the validated parameters without user ID
  const data = await getHistoryData(queryParams.data.timeFrame, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  // Return the fetched data as a JSON response
  return Response.json(data);
};

// Type definition for the response from getHistoryData function
export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

// Fetch history data based on the timeframe (month or year) without user ID
const getHistoryData = async (timeFrame: TimeFrame, period: Period) => {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(period.year); // Fetch data for the whole year
    case "month":
      return await getMonthHistoryData(period.year, period.month); // Fetch data for a specific month
  }
};

// Type definition for history data structure
type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number; // Optional for monthly data
};

// Fetch yearly history data, grouping results by month without user ID
const getYearHistoryData = async (year: number) => {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"], // Group by month
    where: {
      year, // Filter by year
    },
    _sum: {
      expense: true, // Sum of expenses
      income: true, // Sum of income
    },
    orderBy: [
      {
        month: "asc", // Order results by month in ascending order
      },
    ],
  });

  // If no data found, return an empty array
  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  // Iterate over each month of the year
  for (let i = 0; i < 12; i++) {
    let expense = 0;
    let income = 0;

    // Check if data exists for the current month
    const month = result.find((row) => row.month === i);
    if (month) {
      expense = month._sum.expense || 0;
      income = month._sum.income || 0;
    }

    // Push the data into the history array
    history.push({
      year,
      month: i,
      expense,
      income,
    });
  }

  // Return the final history data
  return history;
};

// Fetch monthly history data, grouping results by day without user ID
const getMonthHistoryData = async (year: number, month: number) => {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"], // Group by day
    where: {
      year, // Filter by year
      month, // Filter by month
    },
    _sum: {
      expense: true, // Sum of expenses
      income: true, // Sum of income
    },
    orderBy: [
      {
        day: "asc", // Order results by day in ascending order
      },
    ],
  });

  // If no data found, return an empty array
  if (!result || result.length === 0) return [];

  const history: HistoryData[] = [];

  // Get the total number of days in the given month
  const daysInMonth = getDaysInMonth(new Date(year, month));

  // Iterate over each day of the month
  for (let i = 0; i <= daysInMonth; i++) {
    let expense = 0;
    let income = 0;

    // Check if data exists for the current day
    const day = result.find((row) => row.day === i);
    if (day) {
      expense = day._sum.expense || 0;
      income = day._sum.income || 0;
    }

    // Push the data into the history array
    history.push({
      expense,
      income,
      year,
      month,
      day: i,
    });
  }

  // Return the final history data
  return history;
};