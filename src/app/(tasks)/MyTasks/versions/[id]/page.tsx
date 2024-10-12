import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";

const SingleVersionPage = async ({ params }: { params: { id: string } }) => {
  const version = await prisma.taskHistory.findFirst({
    where: {
      id: params.id,
    },
    include: {
      task: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
        },
      },
    },
  });

  if (!version) return <VersionSkeleton />;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link
        href="/versions"
        className="inline-flex items-center mb-6 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <h3 className="font-bold text-xl">Back to Versions</h3>
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl mb-2">
                Version: {version?.version}
              </CardTitle>
              <Badge>Task Status: {version?.task.status}</Badge>
            </div>
            <Button variant="outline">Edit Version</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <InfoItem
              icon={<Calendar className="h-5 w-5" />}
              label="Updated At"
            >
              {version?.updatedAt &&
                format(new Date(version?.updatedAt), "PPP 'at' p")}
            </InfoItem>
            <InfoItem icon={<User className="h-5 w-5" />} label="Updated By">
              {version?.updatedBy}
            </InfoItem>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 font-semibold">{version?.changes}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Related Task</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-2">{version?.task.name}</h3>
          <p className="text-gray-700 font-semibold mb-4">{version?.task.description}</p>
          <Link href={`/MyTasks/${version?.taskId}`}>
            <Button variant="outline">View Task</Button>
          </Link>

          <div className="flex items-center justify-end">
            <Button variant="outline" className="text-red-500 font-semibold">Delete Version</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingleVersionPage;

function InfoItem({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{children}</p>
      </div>
    </div>
  );
}

function VersionSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Skeleton className="h-6 w-32 mb-6" />
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-16 w-full mb-4" />
          <Skeleton className="h-10 w-28" />
        </CardContent>
      </Card>
    </div>
  );
}
