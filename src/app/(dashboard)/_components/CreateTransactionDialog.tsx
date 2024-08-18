"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

  return (
    <Dialog>
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
        <Form {...form}>
          <form className="space-y-4">
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

          <div className="flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategoryPicker type={type} />
                  </FormControl>
                  <FormDescription>Select a category</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
