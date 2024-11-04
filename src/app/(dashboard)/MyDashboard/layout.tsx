import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "DevelopedByUsama",
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default DashboardLayout;
