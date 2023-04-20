import { ReactNode } from "react";

export const SubTitle = ({ children }: { children: ReactNode }) => {
  return <p className="skt-w text-sm text-white-300 font-medium">{children}</p>;
};
