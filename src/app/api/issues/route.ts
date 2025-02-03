import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const issues = await prisma.issue.findMany({
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

    revalidatePath("/Issues");

    return NextResponse.json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
