"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import CreateAnnouncementDialog from "../_components/CreateAnnouncementDialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { format } from "date-fns";
import DeleteAnnouncementDialog from "../_components/DeleteAnnouncementDialog";
import { EditIcon, TrashIcon } from "lucide-react";
import UpdateAnnouncementDialog from "../_components/UpdateAnnouncementDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// project type safety
type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  deadline: string | null;
  status: "COMPLETED" | "ONGOING" | "CANCELLED";
  priority: "High" | "Low" | "Medium";
};

type Task = {
  project?: {
    id: string;
    name: string;
  };
  id: string;
  name: string;
  status: "Completed" | "Ongoing" | "OnHold" | "Cancelled" | "Todo";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
};

const AnnouncementsPage = () => {
  // fetching announcements with useQuery hook
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetch("/api/announcements").then((res) => res.json()),
  });

  // fetching api that returns all tasks
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["Tasks"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  // fetching api that returns all projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/my-projects").then((res) => res.json()),
  });

  // getting user from clerk for role based access
  const { user } = useUser();

  const role = user?.publicMetadata.role;

  // function to truncate description to display first four words
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 4) {
      return words.slice(0, 4).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold mb-6 text-center sm:text-left">
        Announcements
      </h1>

      {/* New Announcement Logic */}
      <div className="flex items-center justify-start md:justify-end mb-4">
        {role === "admin" && (
          <CreateAnnouncementDialog
            projects={projects}
            tasks={tasks}
            trigger={
              <Button
                variant="outline"
                className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                <span>New Announcement</span>
              </Button>
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {isLoading ? (
          Array.from({ length: 9 }).map((_, index) => (
            <SkeletonWrapper key={index} isLoading={true}>
              <div className="h-36 bg-gray-200 rounded-lg"></div>
            </SkeletonWrapper>
          ))
        ) : announcements.length > 0 ? (
          announcements.map((announcement: any) => (
            <Card
              key={announcement.id}
              className="flex flex-col animate-slideIn"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold text-emerald-500 sm:text-xl flex items-center justify-between">
                  {announcement?.title}
                </CardTitle>
                {format(new Date(announcement?.date), "PP")}
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between p-4">
                <SkeletonWrapper isLoading={isLoading}>
                  <p className="text-xl text-gray-900 dark:text-gray-100 mb-4 h-16 overflow-hidden">
                    {truncateDescription(announcement?.description)}
                    {announcement?.description.split(" ").length > 4 && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <span className="text-emerald-500 cursor-pointer hover:underline">
                            Read More
                          </span>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <h2 className="text-xl font-semibold mb-2">
                            Announcement Description
                          </h2>
                          <p>{announcement?.description}</p>
                        </DialogContent>
                      </Dialog>
                    )}
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Project:
                      </span>
                      <h3 className="text-base font-semibold text-gray-500">
                        {announcement?.project.name}
                      </h3>
                      <h3 className="text-base text-gray-500 lowercase">
                        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                          Status
                        </span>
                        : {announcement?.project?.status}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Task:
                      </span>
                      <h3 className="text-base  text-gray-500">
                        {announcement?.task.name}
                      </h3>
                      <h3 className="text-base text-gray-500 lowercase">
                        <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                          Status
                        </span>
                        : {announcement?.task?.status}
                      </h3>
                    </div>
                  </div>

                  {/* Only admin can delete & update announcements with the following components */}
                  <div className="flex p-2 gap-2 items-center justify-end">
                    {role === "admin" && (
                      <DeleteAnnouncementDialog
                        announcement={announcement}
                        trigger={
                          <Button
                            variant="outline"
                            className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                          >
                            <TrashIcon className="h-4 w-4 " />
                          </Button>
                        }
                      />
                    )}

                    {role === "admin" && (
                      <UpdateAnnouncementDialog
                        announcement={{
                          ...announcement,
                          announcementId: announcement.id,
                        }}
                        projects={projects}
                        tasks={tasks}
                        trigger={
                          <Button
                            variant="outline"
                            className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
                          >
                            <EditIcon className="mr-2 h-4 w-4" />
                          </Button>
                        }
                      />
                    )}
                  </div>
                </SkeletonWrapper>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="items-center">No announcements available.</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
