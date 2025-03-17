import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// fetches projects belonging to a particular user
export const GET = async () => {
  const allProjects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
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

  return Response.json(allProjects);
};
