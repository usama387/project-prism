import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const GET = async () => {
  // Get counts per status
  const statusGroups = await prisma.task.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  // Get total project count
  const totalTasks = await prisma.task.count();

  // Format data for chart
  const statusData = [
    "Todo",
    "Completed",
    "On Hold",
    "Ongoing",
    "Cancelled",
    "Overdue",
  ].map((status) => ({
    status,
    count: statusGroups.find((g) => g.status === status)?._count._all || 0,
  }));

  revalidatePath("/TasksChart");
  return Response.json({ statusData, totalTasks });
};
