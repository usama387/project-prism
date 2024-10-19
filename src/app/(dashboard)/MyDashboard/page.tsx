import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import TotalProjectsCard from "./_components/TotalProjectsCard";
import CompletedProjectsCard from "./_components/CompletedProjectsCard";
import OnGoingProjectsCard from "./_components/OnGoingProjectsCard";
import CancelledProjectsCard from "./_components/CancelledProjectsCard";
import TotalTasksCard from "./_components/TotalTasksCard";
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from "date-fns";
import CompletedTasksCard from "./_components/CompletedTasksCard";
import PendingTasksCard from "./_components/PendingTasksCard";
import OverdueTasksCard from "./_components/OverdueTasksCard";
import RecentProjectsCard from "./_components/SecondSection/RecentProjectsCard";
import UpcomingDeadlinesCard from "./_components/SecondSection/UpcomingDeadlinesCard";
import TeamPerformanceCard from "./_components/SecondSection/TeamPerformanceCard";
import { Separator } from "@/components/ui/separator";

const MyDashboardPage = async () => {
  // getting date methods from date fns to pass in queries
  const now = new Date();

  // to filter data weekly for tasks
  const startOfThisWeek = startOfWeek(now);
  const endOfThisWeek = endOfWeek(now);

  // to filter data monthly for projects
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);

  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // query for total projects card
  const projects = await prisma.project.count({
    where: {
      userId: user.id,
    },
  });

  const projectsCompletedThisMonth = await prisma.project.count({
    where: {
      userId: user.id,
      status: "COMPLETED",
      updatedAt: {
        gte: startOfThisMonth,
        lte: endOfThisMonth,
      },
    },
  });

  // query for completed projects card
  const CompletedProjects = await prisma.project.count({
    where: {
      userId: user.id,
      status: "COMPLETED",
    },
  });

  // query for completed projects card
  const OnGoingProjects = await prisma.project.count({
    where: {
      userId: user.id,
      status: "ONGOING",
    },
  });

  // query for cancelled projects
  const CancelledProjects = await prisma.project.count({
    where: {
      userId: user.id,
      status: "CANCELLED",
    },
  });

  // query for cancelled projects card
  const CancelledProjectsThisMonth = await prisma.project.count({
    where: {
      userId: user.id,
      status: "CANCELLED",
      updatedAt: {
        gte: startOfThisMonth,
        lte: endOfThisMonth,
      },
    },
  });

  // Fetch all tasks for the user
  const TotalTasks = await prisma.task.count({
    where: {
      userId: user.id,
    },
  });

  // Count completed tasks this week
  const CompletedTasksThisWeek = await prisma.task.count({
    where: {
      userId: user.id,
      status: "Completed",
      updatedAt: {
        gte: startOfThisWeek,
        lte: endOfThisWeek,
      },
    },
  });

  // count all the completed tasks in the table
  const CompletedTasks = await prisma.task.count({
    where: {
      userId: user.id,
      status: "Completed",
    },
  });

  // count all the pending tasks in the table
  const PendingTasksThisWeek = await prisma.task.count({
    where: {
      userId: user.id,
      status: "On Hold",
      updatedAt: {
        gte: startOfThisWeek,
        lte: endOfThisWeek,
      },
    },
  });

  // count all the overdue tasks in the table
  const OverdueTasks = await prisma.task.count({
    where: {
      userId: user.id,
      status: "Overdue",
    },
  });

  // query for fetching recent projects
  const RecentProjects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 4,
    select: {
      id: true,
      name: true,
    },
  });

  // query for fetching upcoming deadlines
  const UpComingDeadlines = await prisma.project.findMany({
    where: {
      deadline: {
        not: null,
      },
    },
    orderBy: {
      deadline: "asc",
    },
    select: {
      id: true,
      name: true,
      deadline: true,
    },
  });

  // query for fetching team performance based task completed, client satisfaction and delivered
  const AllTasks = await prisma.task.count({
    where: {
      userId: user.id,
    },
  });

  const CompletedTasksByTeam = await prisma.task.count({
    where: {
      userId: user.id,
      status: "Completed",
    },
  });

  // now calculate percentage of completed tasks
  const PercentageOfCompletedTasks =
    AllTasks > 0 ? (CompletedTasksByTeam / AllTasks) * 100 : 0;

  // query for delivered projects and percentage calculation
  const AllProjects = await prisma.project.count({
    where: {
      userId: user.id,
    },
  });

  const CompletedProjectsByTeam = await prisma.project.count({
    where: {
      userId: user.id,
      status: "COMPLETED",
    },
  });

  const PercentageOfCompletedProjects =
    AllProjects > 0 ? (CompletedProjectsByTeam / AllProjects) * 100 : 0;

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-6 flex flex-col">
      {/* Project Analytics section */}
      <h1 className="text-3xl font-bold tracking-tight">Projects Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* this child component uses react countup which uses useRef behind the scenes and requires client component to render */}

        {/* first card */}
        <TotalProjectsCard
          projects={projects}
          projectsCompletedThisMonth={projectsCompletedThisMonth}
        />

        {/* second card */}
        <CompletedProjectsCard CompletedProjects={CompletedProjects} />

        {/* third card */}
        <OnGoingProjectsCard OnGoingProjects={OnGoingProjects} />

        {/* fourth card */}
        <CancelledProjectsCard
          CancelledProjects={CancelledProjects}
          CancelledProjectsThisMonth={CancelledProjectsThisMonth}
        />
      </div>

      <Separator />

      {/* Task Analytics section */}
      <h1 className="text-3xl font-bold tracking-tight">Task Analytics</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* first card */}
        <TotalTasksCard
          TotalTasks={TotalTasks}
          CompletedTasksThisWeek={CompletedTasksThisWeek}
        />

        {/* second card */}
        <CompletedTasksCard CompletedTasks={CompletedTasks} />

        {/* third card */}
        <PendingTasksCard PendingTasksThisWeek={PendingTasksThisWeek} />

        {/* fourth card */}
        <OverdueTasksCard OverdueTasks={OverdueTasks} />
      </div>

      <Separator />

      {/* Second Section */}
      <h1 className="text-3xl font-bold tracking-tight">Updates</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* first card */}
        <RecentProjectsCard RecentProjects={RecentProjects} />

        {/* second card */}
        <UpcomingDeadlinesCard UpComingDeadlines={UpComingDeadlines} />

        {/* third card */}
        <TeamPerformanceCard
          PercentageOfCompletedTasks={PercentageOfCompletedTasks}
          PercentageOfCompletedProjects={PercentageOfCompletedProjects}
        />
      </div>
    </div>
  );
};

export default MyDashboardPage;
