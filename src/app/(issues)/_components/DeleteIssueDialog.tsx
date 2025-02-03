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
import { Issue } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteIssue } from "../_actions/issue";

interface Props {
  trigger: React.ReactNode;
  issue: Issue;
}

const DeleteIssueDialog = ({ trigger, issue }: Props) => {
  const queryClient = useQueryClient();

  const deleteIssueMutation = useMutation({
    mutationFn: DeleteIssue,
    onSuccess: () => {
      toast.success("Deleted issue successfully", {
        id: "delete-issue",
      });
      queryClient.invalidateQueries({
        queryKey: ["issues"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "delete-issue",
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete this issue?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting Issue...", {
                id: "delete-issue",
              });
              deleteIssueMutation.mutate({
                issueId: issue.id,
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

export default DeleteIssueDialog;
