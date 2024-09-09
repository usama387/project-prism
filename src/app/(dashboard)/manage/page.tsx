"use client";

import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { PlusSquare, TrashIcon, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { json } from "stream/consumers";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";

const ManageCategories = () => {
  return (
    <>
      {/* HEADER */}
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-3xl font-bold">Manage</p>
            <p className="text-muted-foreground">
              Manage your account settings and categories
            </p>
          </div>
        </div>
      </div>

      {/* CURRENCY CUSTOMIZATION COMPONENT */}
      <div className="container flex flex-col gap-4 mt-2">
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>
              Set your default currency for transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* this component lets user customize the currency */}
            <CurrencyComboBox />
          </CardContent>
        </Card>

        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
};

export default ManageCategories;

const CategoryList = ({ type }: { type: TransactionType }) => {
  // this function fetches api to get categories based on type either expense or income
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  //   this variable ensures the availability of data in the api and then pass it to the div to display it
  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            {/* this div renders icons based on the type expense, income */}
            <div className="flex items-center gap-2">
              {type === "expense" && (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              )}
              {type === "income" && (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                {type === "income" ? "Income" : "Expense"} Categories
                <div className="text-sm text-muted-foreground">
                  Sorted by name
                </div>
              </div>
            </div>

            {/* this component lets user create a new category based on type on success it will refetch categoriesQuery api to show new category created*/}
            <CreateCategoryDialog
              type={type}
              SuccessCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm text-emerald-500 bg-black font-semibold">
                  <PlusSquare className="h-4 w-4" />
                  Create Category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        <Separator />

        {/* Now displaying all categories fetched from api */}

        {/* when data is not available */}
        {!dataAvailable && (
          <div className="flex h-40 w-full items-center justify-center">
            <p>
              No
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
                categories yet
              </span>
            </p>

            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}

        {/* when data is available displaying categories */}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {/* mapping all categories and passing it as a prop to display each */}
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="flex flex-col border-separate justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>

      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button
            className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            variant={"secondary"}
          >
            <TrashIcon className="h-4 w-4 " />
            Delete
          </Button>
        }
      />
    </div>
  );
};
