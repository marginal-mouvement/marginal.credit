import { type ReactNode, use, useCallback, useEffect, useState } from "react";
import { CircleCheck, CircleSlash, Plus, RotateCcw } from "lucide-react";
import { ReaderApi } from "@marginal.credit/station-sdk";
import { PulseRingIcon } from "@marginal.credit/ui/svg-spinners-pulse-ring.tsx";
import { Spinner } from "@marginal.credit/ui/spinner.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import {
  RadioGroup,
  RadioGroupItem,
} from "@marginal.credit/ui/radio-group.tsx";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@marginal.credit/ui/field.tsx";
import { Kbd } from "@marginal.credit/ui/kbd.tsx";

import { ReaderStatus } from "./readerStatus.tsx";

import { useReader } from "../../../core/reader/useReader.ts";
import { ShowContext } from "../../../core/show/show.context.tsx";
import { platformSDK } from "../../../core/platform/platformSDK.ts";
import { stationSDK } from "../../../core/sdk/stationSDK.ts";
import { CreateShowDialog } from "../../../core/show/createShow.dialog.tsx";

interface ReaderWriteProps {
  readerId: string;
}

type Status = "idle" | "generating" | "uploading" | "success";

const StatusText: Record<Status, string> = {
  idle: "Awaiting key...",
  generating: "Generating key...",
  uploading: "Uploading key...",
  success: "Key generated and uploaded",
};

const StatusIcon: Record<Status, ReactNode> = {
  idle: <PulseRingIcon />,
  generating: <Spinner />,
  uploading: <Spinner />,
  success: <CircleCheck />,
};

const BadgeVariant = {
  idle: "outline",
  generating: "secondary",
  uploading: undefined,
  success: "success",
} as const satisfies Record<Status, string | undefined>;

export const ReaderWrite = ({ readerId }: ReaderWriteProps) => {
  const { reader, dispatchReaderAction } = useReader(readerId);
  const { shows, showsLoading, createShow, fetchShows } = use(ShowContext);

  const [status, setStatus] = useState<Status>("idle");

  const [showId, setShowId] = useState<string>("");

  const generateKey = useCallback(async () => {
    setStatus("generating");
    const { keyId } = await platformSDK.key.create(
      showId.trim() ? showId.trim() : undefined,
    );
    setStatus("uploading");
    await stationSDK.use(ReaderApi.WriteKeyId, { keyId, readerId });
    setStatus("success");
  }, [readerId, showId]);

  useEffect(() => {
    if (!reader.keyPresence) {
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("idle");
    } else {
      generateKey().catch(console.error);
    }
  }, [dispatchReaderAction, generateKey, reader.keyPresence, readerId]);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  return (
    <div className="flex flex-col gap-10">
      <ReaderStatus
        icon={StatusIcon[status]}
        badgeVariant={BadgeVariant[status]}
        text={StatusText[status]}
        readerId={readerId}
      />
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <h4 className="font-bold">Linked show</h4>
          <Button variant="outline" size="xs" onClick={() => setShowId("")}>
            <RotateCcw /> Reset
          </Button>
        </div>
        {showsLoading ? (
          <Spinner />
        ) : shows.length > 0 ? (
          <RadioGroup
            value={showId}
            className="max-w-sm"
            onValueChange={(value) => setShowId(value)}
          >
            {shows.map((show) => (
              <FieldLabel htmlFor={show.id} key={show.id}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle>{show.name}</FieldTitle>
                    <FieldDescription>
                      Reward: <Kbd>{show.reward}F</Kbd>
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value={show.id} id={show.id} />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
        ) : (
          <p className="text-muted-foreground text-xs flex gap-2">
            <CircleSlash size={14} /> No show
          </p>
        )}

        <CreateShowDialog createShow={createShow}>
          <Button variant="outline" className="w-fit">
            <Plus />
            Create a show
          </Button>
        </CreateShowDialog>
      </div>
    </div>
  );
};
