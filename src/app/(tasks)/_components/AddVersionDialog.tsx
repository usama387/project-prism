"use client";

import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateTaskSchema,
  CreateTaskSchemaType,
} from "../../../../ZodSchema/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTask } from "../_actions/task";
import {
  AddVersionSchema,
  AddVersionSchemaType,
} from "../../../../ZodSchema/taskVersion";
import { AddVersion } from "../_actions/addVersion";

interface Props {
  trigger: ReactNode;
}

type Task = {
  id: string;
  name: string;
  status: "Completed" | "Ongoing" | "OnHold" | "Cancelled" | "Todo";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
};

export default function AddVersionDialog({ trigger }: Props) {
  // fetching task with useQuery
  const { data: tasks } = useQuery<Task[]>({
    queryKey: ["Tasks"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  // managing opening state
  const [open, setOpen] = useState(false);

  // form validation with zod and react hook form
  const form = useForm<AddVersionSchemaType>({
    resolver: zodResolver(AddVersionSchema),
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: AddVersion,
    onSuccess: () => {
      toast.success("Version added Successfully", {
        id: "add-version",
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      form.reset({
        version: "",
        changes: "",
        updatedBy: undefined,
        status: "Ongoing",
        priority: "Medium",
        updatedAt: undefined,
      });
      setOpen(false);
    },
  });

  const onSubmit = useCallback(
    (values: AddVersionSchemaType) => {
      toast.loading("Creating Task...", {
        id: "create-task",
      });
      mutate(values, {
        onError: () => {
          toast.error("Failed to add version", {
            id: "add-version",
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
          <DialogTitle>Add a new version</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* Version Field */}
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Version (Required)</FormDescription>
                </FormItem>
              )}
            />

            {/* Trigger Field */}
            <FormField
              control={form.control}
              name="changes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Reason (Required)</FormDescription>
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
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Todo">To Do</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
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

            {/* UpdatedBy Field */}
            <FormField
              control={form.control}
              name="updatedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Updated By</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value} // Controlled value from the form state
                      onValueChange={field.onChange} // Update the form state when the user selects a priority
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a person" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usama">Usama</SelectItem>
                        <SelectItem value="Maryam">Maryam</SelectItem>
                        <SelectItem value="Noor">Noor</SelectItem>
                        <SelectItem value="Abdul Wasay">Abdul Wasay</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>who made changes (Required)</FormDescription>
                </FormItem>
              )}
            />

            {/* Due Date Field */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between mb-4">
                  <FormLabel className="mt-8">Deadline</FormLabel>
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

            {/* Hours consumed field */}
            <FormField
              control={form.control}
              name="hoursConsumed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Consumed</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter hours consumed by tasks"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/*UpdatedAt Date Field */}
            <FormField
              control={form.control}
              name="updatedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Updated At</FormLabel>
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

            {/* Task relation Field */}
            <FormField
              control={form.control}
              name="taskId"
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
                    Select the task that this version depends on.
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
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
