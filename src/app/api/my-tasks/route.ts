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
      OR: [
        { userId: user.id }, // Tasks created by the current user
        { userId: { not: user.id } }, // Tasks created by other users
      ],
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
      dependency: {
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
