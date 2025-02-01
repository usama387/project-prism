import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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

    return NextResponse.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
