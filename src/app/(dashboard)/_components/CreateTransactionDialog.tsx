"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CreateTransactionSchema,
  CreateTransactionSchemaType,
} from "../../../../ZodSchema/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction } from "../_actions/transactions";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";

interface Props {
  trigger: ReactNode;
  // the type will either be expense or income
  type: TransactionType;
}

// child component of dashboard page
const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  // managing opening & close state of transaction dialog
  const [open, setOpen] = useState(false);

  // when value of category changes this function is called via props in CategoryPicker child component
  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  // an instance to invalidate to refresh responses of api
  const queryClient = useQueryClient();

  // connecting my server action of for creating transaction with useMutation hook of tanstack
  const { mutate, isPending } = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transaction created successfully", {
        id: "create-transaction",
      }),
        // resetting the form back to initial stage
        form.reset({
          type,
          description: "",
          amount: 0,
          date: new Date(),
          category: undefined,
        }),
        // refreshing data on homepage once the transaction is created with queryClient method
        queryClient.invalidateQueries({
          queryKey: ["overview"],
        }),
        // now lets close the transaction dialog
        setOpen(!open);
    },
  });

  // defining my onSubmit for button to call this mutate method for creating transactions in parameter values are passed from zod schema created for transaction type
  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Creating Transaction...", {
        id: "create-transaction",
      });

      mutate({
        ...values,
        date: DateToUTCDate(values.date),
      });
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          Create a new
          <span
            className={cn(
              "m-1",
              type === "income" ? "text-emerald-500" : "text-red-500"
            )}
          >
            {type}
          </span>
          transactions
        </DialogHeader>

        {/* form field with description of a transaction */}
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
                    Transaction Description (optional)
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* form field with amount of a transaction */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input defaultValue={0} type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Transaction Amount (Required)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
          {/* This child component maps and displays categories and select it also whenever a category is updated or selected it will trigger onChange event and update its name  */}
          <div className="flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryPicker
                      type={type}
                      onChange={handleCategoryChange}
                    />
                  </FormControl>
                  <FormDescription>Select a category</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "[w200px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      {/* this component from shadcn lets select a date with builtin  onSelect method and updates the date value in the field */}
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(value) => {
                          if (!value) return;
                          console.log("@@CALENDAR, value");
                          field.onChange(value);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a date for this transaction
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
        {/* This section contains logic of creating a transaction based on type and is connected with a server action */}
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

export default CreateTransactionDialog;
