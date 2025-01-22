import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// this api fetches categories and is being used in categories picker component
export const GET = async (request: Request) => {
  // Get the current user using Clerk authentication
  const user = await currentUser();

  // If no user is found (not authenticated), redirect to the sign-in page
  if (!user) {
    redirect("/sign-in");
  }

  // Extract query parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Get the value of the "type" query parameter (could be "expense" or "income")
  const paramType = searchParams.get("type");

  // Validate the "type" parameter using Zod to ensure it's either "expense" or "income", or null
  const validator = z.enum(["expense", "income"]).nullable();

  // Parse and validate the query parameter
  const queryParams = validator.safeParse(paramType);

  // If validation fails, return an error response with status 500
  if (!queryParams.success) {
    return Response.json(queryParams.error, {
      status: 500,
    });
  }

  // Extract the validated "type" data
  const type = queryParams.data;

  // Query the database to find categories that belong to the current user
  // and optionally filter by the "type" (if provided)
  const categories = await prisma.category.findMany({
    where: {
      userId: user.id, // Filter categories by the current user's ID
      ...(type && { type }), // Add the "type" filter if it exists
    },
    orderBy: {
      name: "asc", // Sort the categories by name in ascending order
    },
  });

  // Return the found categories as a JSON response
  return Response.json(categories);
};
