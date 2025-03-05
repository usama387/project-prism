"use client";

import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import { UserSettings } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
  userSettings: UserSettings;
  from: Date;
  to: Date;
}

const StatsCard = ({ userSettings, from, to }: Props) => {
  const statsQuery = useQuery<GetBalanceStatsResponseType>({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  // The useMemo hook in React is used to optimize performance by memoizing the result of a computation
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const income = statsQuery?.data?.income || 0;
  const expense = statsQuery?.data?.expense || 0;

  const balance = income - expense;

  return (
    <div className="relative w-full flex flex-wrap md:flex-nowrap">
      {/* the skeleton screen loads until api is fetched */}
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {/* passing formatter and others as props to this child */}
        <StatCard
          formatter={formatter}
          value={income}
          title="Budget"
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-emerald-400/10 " />
          }
        />
      </SkeletonWrapper>

      {/* Renders total of Expenses */}
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {/* passing formatter and others as props to this child */}
        <StatCard
          formatter={formatter}
          value={expense}
          title="Expense"
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg p-2 text-red-500 bg-red-400/10 " />
          }
        />
      </SkeletonWrapper>

      {/* Renders total of Balance */}
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        {/* passing formatter and others as props to this child */}
        <StatCard
          formatter={formatter}
          value={balance}
          title="Balance"
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
};

export default StatsCard;

const StatCard = ({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  icon: ReactNode;
  title: String;
  value: number;
}) => {
  // value which is a number is formatted in this function
  const formatFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-2 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          redraw={false}
          end={value}
          decimals={2}
          formattingFn={formatFn}
          className="text-2xl"
        />
      </div>
    </Card>
  );
};
