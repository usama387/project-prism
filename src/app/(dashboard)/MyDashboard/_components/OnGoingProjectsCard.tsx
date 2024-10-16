"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";

interface Props {
  OnGoingProjects: number;
}

const OnGoingProjectsCard = ({ OnGoingProjects }: Props) => {
  return (
    <Link href={"/OnGoingProjects"}>
      <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-emerald-500">
            Ongoing Projects
          </CardTitle>
          <Circle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp
              start={0}
              end={OnGoingProjects || 0}
              duration={2}
              separator=","
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OnGoingProjectsCard;
