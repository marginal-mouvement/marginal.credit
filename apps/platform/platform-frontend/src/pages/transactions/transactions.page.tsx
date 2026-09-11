import { use, useEffect } from "react";
import { CircleSlash, Minus, Plus } from "lucide-react";
import { Spinner } from "@marginal.credit/ui/spinner.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@marginal.credit/ui/item.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@marginal.credit/ui/avatar.tsx";
import { Badge } from "@marginal.credit/ui/badge.tsx";

import { Content } from "../../parts/content.tsx";
import { TransferContext } from "../../modules/transfer/transfer.context.tsx";
import { Header } from "../../parts/header.tsx";
import { DateFormatter } from "../../lib/dateFormatter.ts";

export const TransactionsPage = () => {
  const { loadMyTransfers, transfers, areTransfersLoading } =
    use(TransferContext);

  useEffect(() => {
    loadMyTransfers();
  }, [loadMyTransfers]);

  return (
    <>
      <Header title="Transactions" />
      <Content withHeader>
        {areTransfersLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : transfers.length > 0 ? (
          <div className="flex flex-col gap-4">
            {transfers.map((transaction) => (
              <Item key={transaction.id} variant="outline">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarImage
                      src={transaction.thumbnailUrl}
                      alt={transaction.label}
                    />
                    <AvatarFallback>
                      {transaction.label.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{transaction.label}</ItemTitle>
                  <ItemDescription>
                    {DateFormatter.format(new Date(transaction.date))}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge
                    variant={
                      transaction.kind === "credit" ? "default" : "destructive"
                    }
                  >
                    {transaction.kind === "credit" ? <Plus /> : <Minus />}
                    {transaction.amount}
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <CircleSlash /> Aucune transaction
          </div>
        )}
      </Content>
    </>
  );
};
