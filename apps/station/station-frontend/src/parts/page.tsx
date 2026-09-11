import type { ReactNode } from "react";
import { SidebarInset, SidebarTrigger } from "@marginal.credit/ui/sidebar.tsx";

interface PageProps {
  title: string;
  muted?: string;
  children: ReactNode;
}

export const Page = ({ title, muted, children }: PageProps) => {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-4 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1>{title}</h1>
        {muted && (
          <>
            <h1 className="text-muted">/</h1>
            <h1 className="text-muted-foreground">{muted}</h1>
          </>
        )}
      </header>
      <div className="flex flex-1 flex-col p-4">{children}</div>
    </SidebarInset>
  );
};
