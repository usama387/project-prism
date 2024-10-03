import Navbar from "@/components/Navbar";
import React, { ReactNode } from "react";

const ProjectsPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      <div className="relative h-screen flex flex-col items-center justify-center">
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default ProjectsPageLayout;
