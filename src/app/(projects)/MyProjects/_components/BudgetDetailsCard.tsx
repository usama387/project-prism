import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSignIcon } from "lucide-react";

type Project = {
  budget: number | null;
  usedBudget: number | null;
};

// child component of SingleProjectPage
export default function BudgetDetailsCard({ project }: { project: Project }) {
  // Calculate the percentage of budget used, handling null values
  const budgetUsedPercentage =
  project.budget && project.usedBudget && project.budget > 0
  ? (project.usedBudget / project.budget) * 100
  : 0;
  
  // Format currency values, handling null values
  const formatCurrency = (value: number | null) => {
    if (value === null) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(value);
  };
  
  return (
    <Card className="hover:shadow-xl transform transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Budget Details</CardTitle>
        <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">
          {formatCurrency(project.usedBudget)} /{" "}
          {formatCurrency(project.budget)}
        </div>
        <Progress value={budgetUsedPercentage} className="mt-2" />
        <p className="text-sm text-muted-foreground mt-2">
          {budgetUsedPercentage.toFixed(1)}% of budget used
        </p>
      </CardContent>
    </Card>
  );
}
