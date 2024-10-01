import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
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
import React, { ReactNode } from "react";
import {
  UpdateProjectSchema,
  UpdateProjectSchemaType,
} from "../../../../ZodSchema/Project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateProject } from "../_actions/projects";
import { toast } from "sonner";

interface UpdateProjectDialogProps {
  project: UpdateProjectSchemaType; // Pre-filled project data for update
  trigger: ReactNode;
}

const UpdateProjectDialog = ({
  trigger,
  project,
}: UpdateProjectDialogProps) => {
  
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
    },
  });

  const onSubmit = (values: UpdateProjectSchemaType) => {
    toast.loading("Updating Project...", { id: "update-project" });
    mutate(values, {
      onError: () => {
        toast.error("Failed to update project", { id: "update-project" });
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
        <DialogContent>
          <DialogHeader>Update Project</DialogHeader>
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
                          field.onChange(parseFloat(e.target.value) || 0)
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
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
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
              {/* Contains logic for form submission */}
              <DialogFooter>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {!isPending && "Update"}
                  {isPending && <Loader2 className="animate-spin" />}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </DialogTrigger>
    </Dialog>
  );
};

export default UpdateProjectDialog;
