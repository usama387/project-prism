import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex flex-col h-screen items-center justify-center">
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default layout;
