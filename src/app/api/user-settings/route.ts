import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// this rest api queries user settings table in the db and returns its status
export const GET = async (request: Request) => {
  // getting current user from clerk hook to get its settings
  const user = await currentUser();

  //   if user not found push it back to sign in page
  if (!user) {
    redirect("/sign-in");
  }

  //   take user id and get its settings
  let userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  //   if user is new it can create choose its currency by default it will be PKR
  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "PKR",
      },
    });
  }

  //   refresh the homes screen when api is fetched and return new response
  revalidatePath("/");

  return Response.json(userSettings);
};
