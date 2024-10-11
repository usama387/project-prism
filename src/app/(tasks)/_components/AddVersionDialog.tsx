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
  const { data: tasks} = useQuery<Task[]>({
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
        updatedBy: "",
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

            <FormField
              control={form.control}
              name="changes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Changes</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>Changes (Required)</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="updatedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Updated By</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>who made changes (Required)</FormDescription>
                </FormItem>
              )}
            />

            {/* Due Date Field */}
            <FormField
              control={form.control}
              name="updatedAt"
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
            {!isPending && "Create"}
            {isPending && <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
