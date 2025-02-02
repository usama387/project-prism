"use client";

import React, { ReactNode, useCallback, useState } from "react";
import {
  UpdateAnnouncementSchema,
  UpdateAnnouncementSchemaType,
} from "../../../../ZodSchema/announcement";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UpdateAnnouncement } from "../_actions/announcement";

interface Props {
  trigger: ReactNode;
  announcement: UpdateAnnouncementSchemaType;
  projects: {
    id: string;
    name: string;
  }[];
  tasks: {
    id: string;
    name: string;
  }[];
}

const UpdateAnnouncementDialog = ({
  trigger,
  announcement,
  projects,
  tasks,
}: Props) => {
  // managing opening state of dialog
  const [open, setOpen] = useState(false);

  // form validation with zod and react hook form
  const form = useForm<UpdateAnnouncementSchemaType>({
    resolver: zodResolver(UpdateAnnouncementSchema),
    defaultValues: {
      ...announcement,
      // Ensure date is properly initialized (if it's a string, convert to Date)
      date: announcement.date ? new Date(announcement.date) : undefined,
    },
  });

  // to invalidate query
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateAnnouncement,
    onSuccess: () => {
      toast.success("Announcement updated successfully", {
        id: "update-announcement",
      });

      queryClient.invalidateQueries({
        queryKey: ["announcements"],
        exact: true,
      });

      form.reset({
        title: "",
        description: "",
        date: undefined,
      });
      setOpen(false);
    },
  });

  // onsubmit handler to provoke mutation function
  const onSubmit = useCallback(
    (values: UpdateAnnouncementSchemaType) => {
      console.log("Submitting:", values);
      toast.loading("Updating Announcement...", {
        id: "update-announcement",
      });

      console.log("Form Values" + values);

      mutate(values, {
        onError: () => {
          toast.error("Failed to update announcement", {
            id: "update-announcement",
          });
        },
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Announcement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Announcement Title field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Announcement Title</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Announcement Title (Required)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Announcement description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Task Description (required)</FormDescription>
                </FormItem>
              )}
            />

            {/* Announcement Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormItem>Announced On</FormItem>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="mr-4">Select a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined} // Handle null by passing undefined
                        onSelect={(value) => {
                          if (!value) return;
                          field.onChange(value);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Project relation Field */}
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Project</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the project to associate this announcement with.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Task Relation Field */}
            <FormField
              control={form.control}
              name="taskId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Dependent</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a task" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the task related to this announcement.
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
              }}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending && "Update"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAnnouncementDialog;
