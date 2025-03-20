"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import React, { ReactNode, useState } from "react";
import {
  UpdateProjectSchema,
  UpdateProjectSchemaType,
} from "../../../../ZodSchema/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProject } from "../_actions/projects";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface UpdateProjectDialogProps {
  project: UpdateProjectSchemaType; // Pre-filled project data for update
  trigger: ReactNode;
}

const UpdateProjectDialog = ({
  trigger,
  project,
}: UpdateProjectDialogProps) => {
  // managing state for the dialog
  const [open, setOpen] = useState(false);

  // validating form data with zod and useForm
  const form = useForm<UpdateProjectSchemaType>({
    resolver: zodResolver(UpdateProjectSchema),
    defaultValues: project, // Initialize with existing project data
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateProject,
    onSuccess: () => {
      toast.success("Project Updated Successfully", { id: "update-project" });
      queryClient.invalidateQueries({
        queryKey: ["project", project.projectId],
      });
      setOpen(!open);
    },
  });

  // onSubmit is connected with form and calls mutationFn which is connected to update project server action
  const onSubmit = (values: UpdateProjectSchemaType) => {
    toast.loading("Updating Project...", { id: "update-project" });
    mutate(values, {
      onError: () => {
        toast.error("Failed to update project", { id: "update-project" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogHeader>Update Project</DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Form field for project name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the project (Required)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Form field for project description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    Project Description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Budget & Used Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your budget"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usedBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Used Budget</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter your used budget"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Number of Tasks Field */}
            <FormField
              control={form.control}
              name="numberOfTasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tasks</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of tasks"
                      {...field}
                      value={field.value ?? ""} // Handle null as empty string
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Completed Tasks Field */}
            <FormField
              control={form.control}
              name="completedTasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Tasks Completed</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of completed tasks"
                      {...field}
                      value={field.value ?? ""} // Handle null as empty string
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Controlled value from the form state
                      onValueChange={field.onChange} // Update the form state when the user selects a status
                    >
                      {/* Add SelectTrigger for the dropdown to work properly */}
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Priority Field */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date:</FormLabel>
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

            {/* Deadline */}
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Deadline:</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline">
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span className="mr-4">Select a deadline</span>
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

            {/* Rating from client Field */}
            <FormField
              control={form.control}
              name="clientSatisfaction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Rating </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter (1.0 to 5.0)"
                      {...field}
                      value={field.value ?? ""} // Handle null as empty string
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        {/* Contains logic for form submission */}
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

export default UpdateProjectDialog;
