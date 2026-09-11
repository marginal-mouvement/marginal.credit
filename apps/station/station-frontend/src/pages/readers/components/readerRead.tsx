import { useCallback, useEffect, useState } from "react";
import type { SimpleUser } from "@marginal.credit/platform-sdk";
import { RotateCcw } from "lucide-react";
import { PulseRingIcon } from "@marginal.credit/ui/svg-spinners-pulse-ring.tsx";
import { Tabs, TabsList, TabsTrigger } from "@marginal.credit/ui/tabs.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import { Input } from "@marginal.credit/ui/input.tsx";
import { toast } from "sonner";

import { UserCard } from "./userCard.tsx";
import { ReaderStatus } from "./readerStatus.tsx";

import { platformSDK } from "../../../core/platform/platformSDK.ts";
import { useReader } from "../../../core/reader/useReader.ts";

interface ReaderReadProps {
  readerId: string;
}

export const ReaderRead = ({ readerId }: ReaderReadProps) => {
  const { reader, dispatchReaderAction } = useReader(readerId);
  const [user, setUser] = useState<SimpleUser | undefined>(undefined);

  const [action, setAction] = useState<"debit" | "credit">("debit");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = useCallback(async () => {
    if (!reader.keyId) {
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
      return;
    }

    const user = await platformSDK.user.getByKey(reader.keyId).catch((e) => {
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
      throw e;
    });
    setUser(user);
  }, [dispatchReaderAction, reader.keyId, readerId]);

  useEffect(() => {
    if (reader.keyId === undefined) {
      return;
    }

    dispatchReaderAction({
      type: "lock-reader",
      payload: {
        readerId,
      },
    });

    handleScan().catch(console.error);
  }, [dispatchReaderAction, handleScan, reader.keyId, readerId]);

  const handleCancel = useCallback(() => {
    setUser(undefined);
    dispatchReaderAction({
      type: "unlock-reader",
      payload: {
        readerId,
      },
    });
  }, [dispatchReaderAction, readerId]);

  const debitOrCredit = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      if (action === "debit") {
        await platformSDK.user.debit({
          userId: user.id,
          amount: Number(amount),
          label,
        });
      } else {
        await platformSDK.user.credit({
          userId: user.id,
          amount: Number(amount),
          label,
        });
      }
      toast.success("Transaction successful");
      setUser(undefined);
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [action, amount, dispatchReaderAction, label, readerId, user]);

  return (
    <div className="flex flex-col gap-10">
      <ReaderStatus
        readerId={readerId}
        badgeVariant="outline"
        text="Awaiting key..."
        icon={<PulseRingIcon />}
      />
      {user && (
        <>
          <UserCard user={user} />
          <div className="flex flex-col gap-4 w-sm">
            <div className="flex gap-4 items-center">
              <Tabs defaultValue={action} onValueChange={setAction as any}>
                <TabsList>
                  <TabsTrigger value="debit">Debit</TabsTrigger>
                  <TabsTrigger value="credit">Credit</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="xs" onClick={handleCancel}>
                <RotateCcw /> Cancel
              </Button>
            </div>

            <Input
              placeholder="Label"
              onChangeText={setLabel}
              disabled={isLoading}
            />
            <Input
              placeholder="Amount"
              onChangeText={setAmount}
              disabled={isLoading}
            />
            <Button
              className="w-fit"
              onClick={debitOrCredit}
              disabled={!label || !amount || isLoading}
            >
              {action}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
