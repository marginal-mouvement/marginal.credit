import { ArrowUpRightIcon } from "lucide-react";
import { Badge } from "@marginal.credit/ui/badge.tsx";
import { Card } from "@marginal.credit/ui/card.tsx";

import { Header } from "../../parts/header.tsx";
import { useUser } from "../../modules/auth/useUser.ts";
import { Content } from "../../parts/content.tsx";

export const GatePage = () => {
  const user = useUser();

  return (
    <>
      <Header title={`Bienvenue, ${user.name}`} />
      <Content withHeader className="flex flex-col gap-4">
        <div className="flex justify-center items-center flex-col gap-4 pt-16 pb-24">
          <Badge variant="secondary">Mon solde</Badge>
          <Card className="p-4">
            <h2 className="text-7xl font-bold text-primary">
              {user.balance}
              <span className="text-lg">pts</span>
            </h2>
          </Card>
          <Badge asChild>
            <a href="https://marginalmouvement.com" target="_blank">
              Marginal Mouvement <ArrowUpRightIcon />
            </a>
          </Badge>
        </div>
      </Content>
    </>
  );
};
