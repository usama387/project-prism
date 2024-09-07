"use client";

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, TimeFrame } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
  period: Period;
  setPeriod: (period: Period) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (timeFrame: TimeFrame) => void;
}

// Component to select and display time periods for history (Year or Month)
// This is a child component of the History component
const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: Props) => {
  // Fetches available periods for the history (e.g., available years)
  const historyPeriod = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "period"],
    queryFn: () => fetch(`api/history-periods`).then((res) => res.json()),
  });

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* SkeletonWrapper provides loading indicators while data is being fetched */}
      <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
        {/* Tabs for selecting either 'Year' or 'Month' timeframe */}
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap items-center gap-2">
        {/* Year Selector dropdown to choose a particular year */}
        <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            Years={historyPeriod.data || []}
          />
        </SkeletonWrapper>

        {/* Conditionally render the MonthSelector if the timeframe is 'Month' */}
        {timeFrame === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriod.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

export default HistoryPeriodSelector;

// Component for selecting a year
// Receives available years and sets the selected year in the parent state
const YearSelector = ({
  period,
  setPeriod,
  Years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  Years: GetHistoryPeriodsResponseType;
}) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) => {
        // Updates the selected year while retaining the current month
        setPeriod({
          month: period.month,
          year: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {/* Renders the list of available years */}
        {Years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

// Component for selecting a month
// Receives the current period and allows the user to select a month
const MonthSelector = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) => {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) => {
        // Updates the selected month while retaining the current year
        setPeriod({
          year: period.year,
          month: parseInt(value),
        });
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {/* Maps the numbers 0-11 to their respective month names */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleString(
            "default",
            { month: "long" }
          );

          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
