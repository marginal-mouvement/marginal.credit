import { ArrowLeftRight, Key, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Tabs, TabsList, TabsTrigger } from "@marginal.credit/ui/tabs.tsx";

export const Menu = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 px-4 py-4 w-svw flex items-center justify-center">
      <Tabs className="w-full max-w-lg" value={location.pathname}>
        <TabsList className="grid w-full grid-cols-3 justify-start">
          <Link to="/transactions">
            <TabsTrigger
              className="flex h-full w-full flex-col border-transparent border-b-2 py-2 data-[state=active]:border-primary data-[state=active]:shadow-none [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0"
              value="/transactions"
            >
              <ArrowLeftRight />
              <p className="mt-0.5 text-[13px]">Transactions</p>
            </TabsTrigger>
          </Link>

          <Link to="/">
            <TabsTrigger
              className="flex h-full w-full flex-col border-transparent border-b-2 py-2 data-[state=active]:border-primary data-[state=active]:shadow-none [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0"
              value="/"
            >
              <Key />
              <p className="mt-0.5 text-[13px]">Ma clé</p>
            </TabsTrigger>
          </Link>

          <Link to="/profile">
            <TabsTrigger
              className="flex h-full w-full flex-col border-transparent border-b-2 py-2 data-[state=active]:border-primary data-[state=active]:shadow-none [&>svg]:h-5 [&>svg]:w-5 [&>svg]:shrink-0"
              value="/profile"
            >
              <User />
              <p className="mt-0.5 text-[13px]">Profil</p>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
};
