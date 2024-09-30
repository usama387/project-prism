"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Project } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";
import { DeleteProject } from "../_actions/projects";

interface Props {
  project: Project;
  trigger: ReactNode;
}

// this component is being used on single page of projects and take project as prop to pass its id to delete a project
const DeleteProjectDialog = ({ project, trigger }: Props) => {
  // to invalidate table after mutation for fresh response
  const queryClient = useQueryClient();

  const deleteProjectMutation = useMutation({
    mutationFn: DeleteProject,
    onSuccess: async () => {
      toast.success("Project deleted Successfully", {
        id: "delete-project",
      });

      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "delete-project",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to perform this action?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting Project...", {});
              deleteProjectMutation.mutate({
                projectId: project.id,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectDialog;
