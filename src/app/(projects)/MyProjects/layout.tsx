import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Projects",
  description: "DevelopedByUsama",
};

const ProjectsLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default ProjectsLayout;
