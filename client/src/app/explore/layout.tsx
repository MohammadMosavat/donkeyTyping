import { ReactNode } from "react";

const ExploreLayout = ({ children }: { children: ReactNode }) => {
  return <div className="flex w-full p-40">{children}</div>;
};
export default ExploreLayout;
