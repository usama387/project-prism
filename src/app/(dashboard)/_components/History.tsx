"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import { Period, TimeFrame } from "@/lib/types";
import { UserSettings } from "@prisma/client";
import React, { useCallback, useMemo, useState } from "react";
import HistoryPeriodSelector from "./HistoryPeriodSelector";
import { useQuery } from "@tanstack/react-query";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import CountUp from "react-countup";

// This component is responsible for displaying the user's transaction history
// It provides a visual representation of income and expenses in a bar chart format
const History = ({ userSettings }: { userSettings: UserSettings }) => {
  // State to track the selected timeframe ('month' or 'year')
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");

  // State to track the selected period (month and year)
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(), // Current month
    year: new Date().getFullYear(), // Current year
  });

  // Memoized currency formatter based on user settings
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  // Fetch historical data based on selected timeframe and period
  const historyDataQuery = useQuery({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: () =>
      fetch(
        `/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
      ).then((res) => res.json()),
  });

  // Check if there is available data to display
  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="mt-12 text-2xl font-bold sm:text-3xl">History</h2>
      <Card className="col-span-12 mt-4 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Pass state values to child component for selecting the period and timeframe */}
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />
            <div className="flex h-10 gap-2 justify-center md:justify-end">
              {/* Display badge for income */}
              <Badge className="flex gap-2 items-center text-sm" variant={"outline"}>
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>

              {/* Display badge for expense */}
              <Badge className="flex gap-2 items-center text-sm" variant={"outline"}>
                <div className="h-4 w-4 rounded-full bg-red-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Display skeleton loader while fetching data */}
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable && (
              <ResponsiveContainer width={"100%"} height={300}>
                <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                  <defs>
                    {/* Define gradient for income bar */}
                    <linearGradient id="incomeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={"0"} stopColor="#10b981" stopOpacity={"1"} />
                      <stop offset={"1"} stopColor="#10b981" stopOpacity={"0"} />
                    </linearGradient>

                    {/* Define gradient for expense bar */}
                    <linearGradient id="expenseBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset={"0"} stopColor="#ef4444" stopOpacity={"1"} />
                      <stop offset={"1"} stopColor="#ef4444" stopOpacity={"0"} />
                    </linearGradient>
                  </defs>

                  {/* Chart grid configuration */}
                  <CartesianGrid strokeDasharray="5 5" strokeOpacity={"0.2"} vertical={false} />

                  {/* X-axis configuration */}
                  <XAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    padding={{ left: 5, right: 5 }}
                    dataKey={(data) => {
                      const { year, month, day } = data;
                      const date = new Date(year, month, day || 1);
                      if (timeFrame === "year") {
                        return date.toLocaleDateString("default", {
                          month: "long",
                        });
                      }
                      return date.toLocaleDateString("default", {
                        day: "2-digit",
                      });
                    }}
                  />

                  {/* Y-axis configuration */}
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />

                  {/* Bar for income */}
                  <Bar dataKey={"income"} label="Income" fill="url(#incomeBar)" radius={4} className="cursor-pointer" />

                  {/* Bar for expense */}
                  <Bar dataKey={"expense"} label="Expense" fill="url(#expenseBar)" radius={4} className="cursor-pointer" />

                  {/* Custom tooltip for chart */}
                  <Tooltip
                    cursor={{ opacity: 0.1 }}
                    content={(props) => <CustomToolTip formatter={formatter} {...props} />}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}

            {/* Display message when no data is available */}
            {!dataAvailable && (
              <Card className="flex flex-col h-[300px] items-center justify-center bg-background">
                No data available for this period
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;

// Custom tooltip for displaying income, expense, and balance while hovering over the chart
const CustomToolTip = ({ active, payload, formatter }: any) => {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-red-500"
        textColor="text-red-500"
      />

      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />

      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
};

// Reusable component for rendering rows in the tooltip
const TooltipRow = ({
  label,
  value,
  textColor,
  bgColor,
  formatter,
}: {
  label: string;
  bgColor: string;
  textColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}) => {
  // Use useCallback to prevent unnecessary re-renders of the CountUp component
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
};
