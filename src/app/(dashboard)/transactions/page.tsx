"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import React, { useState } from "react";
import { toast } from "sonner";
import TransactionTable from "./_components/TransactionTable";

const TransactionsPage = () => {
  // this useState is being utilized in DateRangePicker component
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          <div>
            <p className="text-2xl md:text-3xl font-bold">
              Transactions History
            </p>
          </div>
          {/* DateRangePicker is a shadcn ui component that allows date range selection using these methods */}
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            showCompare={false}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) return;
              if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                toast.error(
                  `The selected date range is not allowed, Max date range allowed is ${MAX_DATE_RANGE_DAYS} days!`
                );
                return;
              }
              // setting date range with my useState
              setDateRange({ from, to });
            }}
          />
        </div>
      </div>
      <div className="px-4 md:px-10  overflow-x-auto">
        {/* child component accept props to select date range data */}
        <TransactionTable from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
};

export default TransactionsPage;
