import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const GET = async () => {
  // Get counts per status
  const statusGroups = await prisma.issue.groupBy({
    by: ["status"],
    _count: {
      _all: true,
    },
  });

  // Get total project count
  const totalIssues = await prisma.issue.count();

  // Format data for chart
  const statusData = ["Resolved", "Unresolved", "In Progress", "Closed"].map(
    (status) => ({
      status,
      count: statusGroups.find((g) => g.status === status)?._count._all || 0,
    })
  );

  revalidatePath("/Issues");
  return Response.json({ statusData, totalIssues });
};
