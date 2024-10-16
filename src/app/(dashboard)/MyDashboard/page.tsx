import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { CheckCircle, Circle, ListTodo } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import ProjectsCard from "./_components/TotalProjectsCard";
import TotalProjectsCard from "./_components/TotalProjectsCard";
import CompletedProjectsCard from "./_components/CompletedProjectsCard";
import OnGoingProjectsCard from "./_components/OnGoingProjectsCard";
import CancelledProjectsCard from "./_components/CancelledProjectsCard";

const MyDashboardPage = async () => {
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

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-6 flex flex-col">
      <h1 className="text-3xl font-bold tracking-tight animate-slideIn">
        Projects Analytics
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* this child component uses react countup which uses useRef behind the scenes and requires client component to render */}
        <TotalProjectsCard projects={projects} />

        {/* similarly for completed projects card */}
        <CompletedProjectsCard CompletedProjects={CompletedProjects} />

        {/* similarly for ongoing projects card */}
        <OnGoingProjectsCard OnGoingProjects={OnGoingProjects} />

        {/* similarly for cancelled projects card */}
        <CancelledProjectsCard CancelledProjects={CancelledProjects} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">
              24 tasks completed this week
            </p>
          </CardContent>
        </Card>
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
