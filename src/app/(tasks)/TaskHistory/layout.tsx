import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const TaskHistoryPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="relative h-screen items-center justify-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default TaskHistoryPageLayout;
