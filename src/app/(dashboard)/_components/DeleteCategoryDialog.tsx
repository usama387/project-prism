"use client";

import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReactNode } from "react";
import { DeleteCategory } from "../_actions/categories";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDescription } from "@/components/ui/alert";
import { TransactionType } from "@/lib/types";

interface Props {
  trigger: ReactNode;
  category: Category;
}

const DeleteCategoryDialog = ({ trigger, category }: Props) => {
  const categoryIdentifier = `${category.name}-${category.type}`;

  const queryClient = useQueryClient();

  const deleteCategoryMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success("Category deleted successfully", {
        id: categoryIdentifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: categoryIdentifier,
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
          <AlertDescription>This cannot be undone</AlertDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading("Deleting Category...", {
                id: categoryIdentifier,
              });
              deleteCategoryMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
                icon: ""
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

export default DeleteCategoryDialog;
