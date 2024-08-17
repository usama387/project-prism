"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "../../hooks/use-media-query";
import { Currencies, Currency } from "@/lib/currencies";
import { useMutation, useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "./SkeletonWrapper";
import { UserSettings } from "@prisma/client";
import { updateUserCurrency } from "@/app/wizard/_actions/userSettings";
import { toast } from "sonner";

// child component of wizard page
export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedCurrencyOption, setSelectedCurrencyOption] =
    React.useState<Currency | null>(null);

  // fetching api with react query
  const userSettings = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then((res) => res.json()),
  });

  React.useEffect(() => {
    // If userSettings.data is not available, exit the useEffect early
    if (!userSettings.data) return;

    // Find the currency in the Currencies array that matches the user's selected currency
    const userCurrency = Currencies.find(
      (currency) => currency.value === userSettings.data.currency
    );

    // If a matching currency is found, update the selected currency option state
    if (userCurrency) setSelectedCurrencyOption(userCurrency);

    // Run this effect whenever userSettings.data changes
  }, [userSettings.data]);

  // updating user currency by passing my server action to tanstack mutation function after success show relevant response and update the state
  const mutation = useMutation({
    mutationFn: updateUserCurrency,
    onSuccess: (data: UserSettings) => {
      toast.success(`Currency has been updated`, {
        id: "update-currency",
      });
      setSelectedCurrencyOption(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },

    // on error toast will appear
    onError: (e) => {
      toast.error("Something went wrong", {
        id: "update-currency",
      });
    },
  });

  // function that invokes mutation server action and checks conditions to perform
  const selectedCurrency = React.useCallback(
    (currency: Currency | null) => {
      if (!currency) {
        toast.error("Please select a currency");
        return;
      }

      toast.loading("Updating Currency...", {
        id: "update currency",
      });

      mutation.mutate(currency.value);
    },
    [mutation]
  );

  // for desktop screens
  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={userSettings.isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-center"
              // button will be disabled while updating
              disabled={mutation.isPending}
            >
              {selectedCurrencyOption ? (
                <>{selectedCurrencyOption.label}</>
              ) : (
                <>Set Currency</>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <OptionList
              setOpen={setOpen}
              // calling mutation function connected to server action here
              setSelectedCurrencyOption={selectedCurrency}
            />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    );
  }

  return (
    <SkeletonWrapper isLoading={userSettings.isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-center" // button will be disabled while updating
            disabled={mutation.isPending}
          >
            {selectedCurrencyOption ? (
              <>{selectedCurrencyOption.label}</>
            ) : (
              <> Set Currency</>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <OptionList
              setOpen={setOpen}
              // calling mutation function connected to server action here
              setSelectedCurrencyOption={selectedCurrency}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  );
}

function OptionList({
  setOpen,
  setSelectedCurrencyOption,
}: {
  setOpen: (open: boolean) => void;
  setSelectedCurrencyOption: (status: Currency | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrencyOption(
                  Currencies.find((priority) => priority.value === value) ||
                    null
                );
                setOpen(false);
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
