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
import { endOfWeek, startOfWeek } from "date-fns";
import CompletedTasksCard from "./_components/CompletedTasksCard";
import PendingTasksCard from "./_components/PendingTasksCard";
import OverdueTasksCard from "./_components/OverdueTasksCard";

const MyDashboardPage = async () => {
  // getting date methods from date fns to pass in queries
  const now = new Date();
  const startOfThisWeek = startOfWeek(now);
  const endOfThisWeek = endOfWeek(now);

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

  // query for cancelled projects card
  const CancelledProjects = await prisma.project.count({
    where: {
      status: "CANCELLED",
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

  const OverdueTasks = await prisma.task.count({
    where: {
      userId: user.id,
      status: "Overdue",
    },
  });

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-6 flex flex-col">
      {/* Project Analytics section */}
      <h1 className="text-3xl font-bold tracking-tight">Projects Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* this child component uses react countup which uses useRef behind the scenes and requires client component to render */}

        {/* first card */}
        <TotalProjectsCard projects={projects} />

        {/* second card */}
        <CompletedProjectsCard CompletedProjects={CompletedProjects} />

        {/* third card */}
        <OnGoingProjectsCard OnGoingProjects={OnGoingProjects} />

        {/* fourth card */}
        <CancelledProjectsCard CancelledProjects={CancelledProjects} />
      </div>

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>E-commerce Platform</li>
              <li>Mobile App Redesign</li>
              <li>API Integration</li>
              <li>Data Analytics Dashboard</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Website Redesign - 15 May</li>
              <li>User Authentication System - 22 May</li>
              <li>Payment Gateway Integration - 1 June</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>Tasks Completed: 78%</li>
              <li>On-time Delivery: 92%</li>
              <li>Client Satisfaction: 4.7/5</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyDashboardPage;
