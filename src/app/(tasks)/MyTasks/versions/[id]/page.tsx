import DeleteVersionDialog from "@/app/(tasks)/_components/DeleteVersionDialog";
import UpdateVersionDialog from "@/app/(tasks)/_components/UpdateVersionDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { ArrowLeft, Calendar, EditIcon, TrashIcon, User } from "lucide-react";
import Link from "next/link";

const SingleVersionPage = async ({ params }: { params: { id: string } }) => {
  // getting user from clerk for role based access
  const user = await currentUser();

  // getting role from user metadata
  const role = user?.publicMetadata.role;

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

  // function to truncate description to display first 7 words
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 7) {
      return words.slice(0, 7).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Link
        href="/MyTasks/versions"
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

            {role === "admin" && (
              <UpdateVersionDialog
                version={{
                  versionId: version.id,
                  version: version.version,
                  changes: version.changes,
                  updatedBy: version.updatedBy as
                    | "Usama"
                    | "Maryam"
                    | "Noor"
                    | "Abdul Wasay",
                  updatedAt: version.updatedAt ?? undefined,
                  taskId: version.taskId,
                  priority: version.priority as "Low" | "Medium" | "High",
                }}
                trigger={
                  <Button
                    className="flex w-max items-center gap-2 text-muted-foreground text-base text-emerald-500 hover:bg-red-500/20"
                    variant={"secondary"}
                  >
                    <EditIcon className="mr-2 h-4 w-4" />
                    Edit Version
                  </Button>
                }
              />
            )}
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

      {/* Trigger and deadline card */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Trigger</CardTitle>
          <CardTitle className="text-xl">Deadline</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row items-center justify-between">
          <p className="text-gray-500 font-semibold">
            {truncateDescription(version?.changes)}
            {version?.changes && version?.changes.split(" ").length > 7 && (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="text-emerald-500 cursor-pointer hover:underline">
                    Read More
                  </span>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <h2 className="text-xl font-semibold mb-2">
                    Changes Description
                  </h2>
                  <p>{version?.changes}</p>
                </DialogContent>
              </Dialog>
            )}
          </p>
          <p className="text-gray-500 font-semibold">
            {version.dueDate && format(new Date(version.dueDate), "PPP")}
          </p>
        </CardContent>
      </Card>

      {/* Related Task Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Related Task</CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-lg mb-2 text-emerald-400">
            {version?.task.name}
          </h3>
          <p className="text-gray-500 font-semibold mb-4">
            {truncateDescription(version?.task?.description!)}
            {version?.task?.description &&
              version?.task?.description.split(" ").length > 7 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-emerald-500 cursor-pointer hover:underline">
                      Read More
                    </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-2">
                      Related Task Description
                    </h2>
                    <p>{version?.task?.description}</p>
                  </DialogContent>
                </Dialog>
              )}
          </p>
          <Link href={`/MyTasks/${version?.taskId}`}>
            <Button variant="outline">View Task</Button>
          </Link>

          {/* Delete task version logic */}
          <div className="flex items-center justify-end">
            {role === "admin" && (
              <DeleteVersionDialog
                version={version}
                trigger={
                  <Button
                    className="flex w-max items-center gap-2 text-muted-foreground text-base text-red-500-500 hover:bg-red-500/20"
                    variant={"secondary"}
                  >
                    <TrashIcon className="h-4 w-4 " />
                    Delete Version
                  </Button>
                }
              />
            )}
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
