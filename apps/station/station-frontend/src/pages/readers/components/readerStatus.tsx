import type { ReactNode } from "react";
import { Lock, Nfc } from "lucide-react";
import { Card } from "@marginal.credit/ui/card.tsx";
import { Badge } from "@marginal.credit/ui/badge.tsx";

import { useReader } from "../../../core/reader/useReader.ts";

interface ReaderStatusProps {
  icon: ReactNode;
  badgeVariant?: "outline" | "destructive" | "secondary" | "success";
  text: string;
  readerId: string;
}

export const ReaderStatus = ({
  icon,
  text,
  badgeVariant,
  readerId,
}: ReaderStatusProps) => {
  const { reader } = useReader(readerId);

  return (
    <Card className="text-muted-foreground flex flex-col justify-center items-center gap-4 w-sm">
      <Nfc />
      {reader.locked ? (
        <Badge variant="destructive">
          <Lock /> Busy
        </Badge>
      ) : (
        <Badge variant={badgeVariant}>
          {icon} {text}
        </Badge>
      )}
    </Card>
  );
};
