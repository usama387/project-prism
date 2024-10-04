import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// this api is being fetched in MyTasks page
export const GET = async () => {
  // authenticating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userTasks = await prisma.task.findMany({
    where: {
      userId: user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      dependencies: {
        select: {
          id: true,
          name: true,
        },
      },
      dependentOn: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return Response.json(userTasks);
};
