import type { ReactNode } from "react";
import { cn } from "@marginal.credit/ui/utils.ts";

interface ContentProps {
  withHeader?: boolean;
  children: ReactNode;
  className?: string;
}

export const Content = ({ children, withHeader, className }: ContentProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "px-4 w-full max-w-lg pb-28",
          withHeader && "pt-20",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
};
