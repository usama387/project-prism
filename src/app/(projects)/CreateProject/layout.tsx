import React, { ReactNode } from "react";

const ProjectsPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative h-screen flex flex-col items-center justify-center">
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export default ProjectsPageLayout;
