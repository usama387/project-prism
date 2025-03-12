import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import Overview from "./_components/Overview";
import History from "./_components/History";

const DashboardPage = async () => {
  // getting user to display its details
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // to extract role from user
  const role = user?.publicMetadata.role;

  // now fetching details User Settings table to display currency settings of user
  const UserSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  // if there is no currency selected push user on wizard page
  if (!UserSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background px-8">
      <div className="border-b bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
          {/* <p className="text-3xl font-bold">Hello, {user.firstName}! 👋</p> */}
          <div className="flex items-center gap-3">
            {/* create transaction dialog is a child client component which creates transactions for project the type is passed as props which is either income or expense  */}
            {role === "admin" && (
              <CreateTransactionDialog
                trigger={
                  <Button
                    variant={"outline"}
                    className="border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white"
                  >
                    New Budget
                  </Button>
                }
                type="income"
              />
            )}

            {role === "admin" && (
              <CreateTransactionDialog
                trigger={
                  <Button
                    variant={"outline"}
                    className="border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white"
                  >
                    New Expense
                  </Button>
                }
                type="expense"
              />
            )}
          </div>
        </div>
      </div>

      {/* OVERVIEW SECTION */}
      <Overview userSettings={UserSettings} />

      {/* HISTORY SECTION */}
      <History userSettings={UserSettings} />
    </div>
  );
};

export default DashboardPage;
