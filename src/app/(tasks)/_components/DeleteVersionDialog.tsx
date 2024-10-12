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
import { TaskHistory } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { toast } from "sonner";
import { DeleteTaskVersion } from "../_actions/deleteVersion";

interface Props {
  trigger: ReactNode;
  version: TaskHistory;
}

const DeleteVersionDialog = ({ version, trigger }: Props) => {
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: DeleteTaskVersion,
    onSuccess: () => {
      toast.success("Deleted version successfully", {
        id: "delete-version",
      });
      queryClient.invalidateQueries({
        queryKey: ["TaskHistory"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "delete-version",
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
              toast.loading("Deleting Version...", {
                id: "delete-version",
              });
              deleteTaskMutation.mutate({
                taskHistoryId: version.id,
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

export default DeleteVersionDialog;
