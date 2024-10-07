"use client";

import React, { ReactNode, useState } from "react";
import {
  UpdateTaskSchema,
  UpdateTaskSchemaType,
} from "../../../../ZodSchema/task";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { UpdateTask } from "../_actions/task";

interface Props {
  trigger: ReactNode;
  task: UpdateTaskSchemaType;
}

type Task = {
  id: string;
  name: string;
  status: "Completed" | "Ongoing" | "OnHold" | "Cancelled" | "Todo";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
};

type Project = {
  id: string;
  name: string;
  status: "COMPLETED" | "ONGOING" | "CANCELLED";
  priority: "Low" | "Medium" | "High";
  deadline: string;
  startDate: string;
  budget: number;
  usedBudget: number;
  numberOfTasks: number;
  completedTasks: number;
};

const UpdateTaskDialog = ({ task, trigger }: Props) => {
  // fetching task with useQuery
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["Tasks"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  // fetching projects with useQuery
  const { data: projects } = useQuery<Project[]>({
    queryKey: ["Projects"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  // opening state for dialog
  const [open, setOpen] = useState(false);

  //   validating form data with zod and react hook form
  const form = useForm<UpdateTaskSchemaType>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: task,
  });

  //   instance for invalidating queries
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: UpdateTask,
    onSuccess: () => {
      toast.success("Task updated successfully", {
        id: "update-task",
      });
      queryClient.invalidateQueries({
        queryKey: ["task", task.taskId],
      });
      setOpen(!open);
    },
  });

  const onSubmit = (values: UpdateTaskSchemaType) => {
    toast.loading("Updating Task", {
      id: "update-project",
    });
    mutate(values, {
      onError: () => {
        toast.error("Failed to update task", { id: "update-task" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Edit Task Details</DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Task name field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    The name of the task (Required)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Task description field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Task Description (optional)</FormDescription>
                </FormItem>
              )}
            />

            {/* Task Status Field */}
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                        <SelectItem value="OnHold">On Hold</SelectItem>
                        <SelectItem value="Todo">To Do</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select current status of the task
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Task Priority Field */}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Controlled value from the form state
                      onValueChange={field.onChange} // Update the form state when the user selects a priority
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select priority for the task
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Due Date Field */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
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
            {/* Task Responsible Person */}
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignee name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Who is responsible for this task?
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Estimated Hours Field */}
            <FormField
              control={form.control}
              name="estimatedHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter estimated hours"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Actual Hours Field */}
            <FormField
              control={form.control}
              name="actualHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Actual Hours</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter actual hours"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* Risk Flag Field */}
            <FormField
              control={form.control}
              name="riskFlag"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Risk Flag</FormLabel>
                    <FormDescription>
                      Check this if the task has potential risks.
                    </FormDescription>
                  </div>
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
                        {projects &&
                          projects.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              {project.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select the project to associate this task with.
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Task Dependencies Field */}
            <FormField
              control={form.control}
              name="dependency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Dependent</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dependency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks &&
                        tasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the tasks that depend on this task
                  </FormDescription>
                </FormItem>
              )}
            />
            {/* Dependent Tasks Field */}
            <FormField
              control={form.control}
              name="dependentOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Dependency</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dependency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tasks &&
                        tasks.map((task) => (
                          <SelectItem key={task.id} value={task.id}>
                            {task.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the task that this task depends on.
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

export default UpdateTaskDialog;
