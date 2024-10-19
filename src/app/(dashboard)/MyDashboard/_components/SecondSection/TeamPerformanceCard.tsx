import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface Props {
  PercentageOfCompletedTasks: number;
  PercentageOfCompletedProjects: number;
  AverageSatisfaction: number;
}

const TeamPerformanceCard = ({
  PercentageOfCompletedTasks,
  PercentageOfCompletedProjects,
  AverageSatisfaction,
}: Props) => {
  return (
    <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
      <CardHeader>
        <CardTitle className="text-base font-medium text-emerald-500 flex flex-row items-center justify-between">
          Team Performance
          <Users />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-base text-muted-foreground">
          <p>Tasks Completed: {PercentageOfCompletedTasks || 0} %</p>
          <p>On-time Delivery: {PercentageOfCompletedProjects || 0}%</p>
          <p>Client Satisfaction: {AverageSatisfaction}/5</p>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TeamPerformanceCard;
