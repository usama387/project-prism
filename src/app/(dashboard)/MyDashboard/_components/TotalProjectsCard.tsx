"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import React from "react";
import CountUp from "react-countup";

interface Props {
  projects: number;
  projectsCompletedThisMonth: number;
}

const TotalProjectsCard = ({ projects, projectsCompletedThisMonth }: Props) => {
  return (
    <Link href={"/MyProjects"}>
      <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-emerald-500">
            Total Projects
          </CardTitle>
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-start">
            <CountUp start={0} end={projects || 0} duration={2} separator="," />
          </div>
          <p className="text-base text-muted-foreground">
            {projectsCompletedThisMonth || 0} projects completed this month
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TotalProjectsCard;
