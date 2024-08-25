"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@prisma/client";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

const Overview = ({ userSettings }: { userSettings: UserSettings }) => {

  // managing date range state
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6 sm:flex-nowrap">
        <h2 className="text-2xl font-bold sm:text-3xl">Overview</h2>
        <div className="w-full flex flex-col sm:flex-row sm:w-auto items-center gap-3">
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
    </>
  );
};

export default Overview;
