import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-screen w-full flex-col ">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
