import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const GET = async () => {
  // Get counts per status
  const statusGroups = await prisma.project.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  // Get total project count
  const totalProjects = await prisma.project.count();

  // Format data for chart
  const statusData = ["COMPLETED", "ONGOING", "CANCELLED"].map((status) => ({
    status,
    count: statusGroups.find((g) => g.status === status)?._count._all || 0,
  }));

  revalidatePath("/ProjectChart");
  return Response.json({ statusData, totalProjects });
};
