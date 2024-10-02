"use client";

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
import { ReactNode, useCallback, useState } from "react";
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
} from "../../../../ZodSchema/Project";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProject } from "../_actions/projects";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  trigger: ReactNode;
}
const CreateProjectDialog = ({ trigger }: Props) => {

  // validating form data with zod and useForm
  const form = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(CreateProjectSchema),
  });

  // managing state for the dialog
  const [open, setOpen] = useState(false);

  // for invalidating queries
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateProject,
    onSuccess: () => {
      toast.success("Project Created Successfully", {
        id: "create-project",
      });
      // Invalidate the project queries to refetch the updated project list
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      }),
        // Reset the form fields after successful project creation
        form.reset({
          name: "",
          description: "",
          startDate: undefined,
          deadline: undefined,
          status: "ONGOING",
          priority: "Medium",
          budget: 0,
          usedBudget: 0,
          numberOfTasks: 1,
          completedTasks: 0,
        });
      setOpen(!open);
    },
  });

  // onSubmit function for the form
  const onSubmit = useCallback(
    (values: CreateProjectSchemaType) => {
      // Show a loading toast while the project is being created
      toast.loading("Creating Project...", {
        id: "create-project",
      });

      // Call the mutate function to create the project
      mutate(values, {
        onError: () => {
          // Show error toast if there is a failure in creating the project
          toast.error("Failed to create project", {
            id: "create-project",
          });
        },
      });
    },
    [mutate, queryClient, form, setOpen]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Create a new Project</DialogHeader>

        {/* form starts now */}
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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

            {/* {Budget Field} */}
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
                      value={field.value ?? ""} // Handle null as empty string
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Used Budget Field */}
            <FormField
              control={form.control}
              name="usedBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Used Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter your budget"
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
                <FormItem className="flex items-center justify-between">
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
                <FormItem className="flex items-center justify-between">
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
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"secondary"}
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
};

export default CreateProjectDialog;
