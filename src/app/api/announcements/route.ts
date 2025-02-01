import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const GET = async () => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: {
        project: {
          select: {
            name: true,
            status: true,
          },
        },
        task: {
          select: {
            name: true,
            status: true,
          },
        },
      },
    });

    revalidatePath("/MyProjects");

    return Response.json(announcements);
  } catch (error) {
    console.log(error);
  }
};
