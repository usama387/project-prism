"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import CreateCategoryDialog from "./CreateCategoryDialog";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
}

const CategoryPicker = ({ type }: Props) => {
  // managing state for category picker pop up
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState("");

  // using tanstack query Fn fetching categories based on income or expense
  const categoryQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  // Attempt to find the category with the matching name from categoryQuery.data
  const selectedCategory = categoryQuery.data?.find(
    // For each category in the data array, check if the category name matches the provided value
    (category: Category) => category.name === value
  );

  const successCallBack = useCallback(
    (category: Category) => {
      setValue(category.name);
      setOpen(!open);
    },
    [setValue, setOpen]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select a category"
          )}
          <ChevronsUpDown className="ml-2 h-4 shrink-0 opacity-50 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <CommandInput placeholder="search category..." />
          {/* child component that creates category based on type passed as prop either expense or income */}
          <CreateCategoryDialog type={type} SuccessCallback={successCallBack} />
          <CommandEmpty>
            <p>Category not found</p>
            <p className="text-xs text-muted-foreground">
              Tip: Create a new category
            </p>
          </CommandEmpty>
          <CommandGroup>
            <CommandList>
              {categoryQuery.data &&
                categoryQuery.data.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    // onSelect is a callback function that sets the value of useState with name of category clicked by user
                    onSelect={() => {
                      setValue(category.name);
                      setOpen(!open);
                    }}
                  >
                    {/* child component takes prop and display each category */}
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "mr-2 w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryPicker;

function CategoryRow({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-2">
      <span className="" role="img">
        {category.icon}
        <span>{category.name}</span>
      </span>
    </div>
  );
}
