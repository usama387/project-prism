"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, TimeFrame } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useMemo, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";

// child of overview component
const History = ({ userSettings }: { userSettings: UserSettings }) => {

  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="mt-12 text-2xl font-bold sm:text-3xl">History</h2>
      <Card className="col-span-12 mt-4 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* passing all useStates to child component */}
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <div className="flex h-10 gap-2 justify-center md:justify-end">
              <Badge
                className="flex gap-2 items-center text-sm"
                variant={"outline"}
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>

              <Badge
                className="flex gap-2 items-center text-sm"
                variant={"outline"}
              >
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default History;
