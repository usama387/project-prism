import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid } from "lucide-react";

interface Props {
  RecentProjects: any;
}

const RecentProjectsCard = ({ RecentProjects }: Props) => {
  return (
    <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
      <CardHeader>
        <CardTitle className="text-base font-medium text-emerald-600 dark:text-emerald-500 flex flex-row items-center justify-between">
          Recent Projects
          <LayoutGrid />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {RecentProjects.length > 0 ? (
            RecentProjects.map((project: any) => (
              <li key={project.id} className="text-base text-muted-foreground">
                {project.name}
              </li>
            ))
          ) : (
            <li className="font-semibold text-base text-muted-foreground">No recent projects found</li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};

export default RecentProjectsCard;
