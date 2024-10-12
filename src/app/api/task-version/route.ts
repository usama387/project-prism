import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const GET = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const TaskVersions = await prisma.taskHistory.findMany({
    where: {
      userId: user.id,
    },

    // task history table has relation with task table so fetching its id and name
    include: {
      task: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return Response.json(TaskVersions);
};
