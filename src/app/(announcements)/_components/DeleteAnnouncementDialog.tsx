import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Announcement } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteAnnouncement } from "../_actions/announcement";

interface Props {
  trigger: React.ReactNode;
  announcement: Announcement;
}

const DeleteAnnouncementDialog = ({ trigger, announcement }: Props) => {

    const queryClient = useQueryClient();

  const deleteAnnouncementMutation = useMutation({
    mutationFn: DeleteAnnouncement,
    onSuccess: () => {
      toast.success("Deleted announcement successfully", {
        id: "delete-announcement",
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements"],
      });
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: "delete-announcement",
      });
    },
  });

  return <AlertDialog>
  <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Are you sure to delete this announcement?
      </AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={() => {
          toast.loading("Deleting Announcement...", {
            id: "delete-task",
          });
          deleteAnnouncementMutation.mutate({
            announcementId: announcement.id,
          });
        }}
      >
        Continue
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
};

export default DeleteAnnouncementDialog;
