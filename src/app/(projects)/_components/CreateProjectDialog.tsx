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
import { Select } from "@/components/ui/select";

interface Props {
  trigger: ReactNode;
}
const CreateProjectDialog = ({ trigger }: Props) => {
  // validating form data
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
          taskCount: 0,
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

            {/* Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Start Date</FormLabel>
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
                  <FormLabel>Deadline</FormLabel>
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

            <FormField
              control={form.control}
              name="taskCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Tasks</FormLabel>
                  <FormControl>
                    <Input defaultValue={1} type="number" {...field} />
                  </FormControl>
                  <FormDescription>No of Tasks (optional)</FormDescription>
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
