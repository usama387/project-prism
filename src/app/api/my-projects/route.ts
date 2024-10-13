import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// fetches projects belonging to a particular user
export const GET = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    include: {
      tasks: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          dueDate: true,

          // Count task histories / versions for each task
          _count: {
            select: {
              TaskHistory: true,
            },
          },
        },
      },
    },
  });

  revalidatePath("/MyProjects");

  return Response.json(userProjects);
};
