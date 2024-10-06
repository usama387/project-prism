"use client";

import { Task } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { DeleteTask } from "../_actions/task";
import { toast } from "sonner";
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

interface Props {
  trigger: ReactNode;
  task: Task;
}

const DeleteTaskDialog = ({ trigger, task }: Props) => {
  const queryClient = useQueryClient();

  const deleteTaskMutation = useMutation({
    mutationFn: DeleteTask,
    onSuccess: () => {
      toast.success("Deleted task successfully", {
        id: "delete-task",
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "delete-task",
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
              toast.loading("Deleting Task...", {
                id: "delete-task",
              });
              deleteTaskMutation.mutate({
                taskId: task.id,
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

export default DeleteTaskDialog;
