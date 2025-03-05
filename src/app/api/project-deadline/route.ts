import prisma from "@/lib/prisma";

export const GET = async () => {
  const currentYear = new Date().getFullYear(); 
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
  ];

  const chartData = [];

  for (let i = 0; i < months.length; i++) {
    const monthIndex = i; // 0 = January, 1 = February, etc.
    const startOfMonth = new Date(currentYear, monthIndex, 1);
    const endOfMonth = new Date(currentYear, monthIndex + 1, 0, 23, 59, 59);

    const count = await prisma.project.count({
      where: {
        status: "ONGOING", // Only count ongoing projects
        deadline: {
          gte: startOfMonth, // Greater than or equal to start of month
          lte: endOfMonth,   // Less than or equal to end of month
        },
      },
    });

    chartData.push({ month: months[i], count: count });
  }

  return Response.json(chartData);
};