import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Megaphone } from "lucide-react";

interface Props {
  UpComingDeadlines: any;
}

const UpcomingDeadlinesCard = ({ UpComingDeadlines }: Props) => {
  return (
    <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
      <CardHeader>
        <CardTitle className="text-base font-medium text-emerald-500 flex flex-row items-center justify-between">
          Upcoming Deadlines
          <Megaphone />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {UpComingDeadlines.length > 0 ? (
            UpComingDeadlines.map((project: any) => (
              <li key={project.id} className="text-base text-muted-foreground">
                {project.name} - {format(new Date(project.deadline), "dd MMM")}
              </li>
            ))
          ) : (
            <li>No upcoming deadlines found</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default UpcomingDeadlinesCard;
