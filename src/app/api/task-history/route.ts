import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const GET = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const taskHistory = await prisma.task.findMany({
    where: {
      userId: user.id,
    },
  });

  revalidatePath("/TaskHistory");

  return Response.json(taskHistory);
};
