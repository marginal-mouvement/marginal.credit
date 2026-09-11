import { type ReactNode, useCallback, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { ShowApi } from "@marginal.credit/platform-sdk";
import type { PayloadOf } from "@marginal.credit/sdk";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@marginal.credit/ui/dialog.tsx";
import { AspectRatio } from "@marginal.credit/ui/aspect-ratio.tsx";
import { Field, FieldLabel } from "@marginal.credit/ui/field.tsx";
import { Input } from "@marginal.credit/ui/input.tsx";
import { Button } from "@marginal.credit/ui/button.tsx";
import { Spinner } from "@marginal.credit/ui/spinner.tsx";
import { DatePicker } from "@marginal.credit/ui/datePicker.tsx";

interface CreateShowDialogProps {
  children: ReactNode;
  createShow: (payload: PayloadOf<typeof ShowApi.Create>) => Promise<void>;
}

export const CreateShowDialog = ({
  children,
  createShow,
}: CreateShowDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [reward, setReward] = useState("");
  const [date, setDate] = useState(new Date());

  const handleRewardChange = useCallback((value: string) => {
    if (value === "") {
      setReward("");
      return;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue) || numberValue < 1 || value.includes(".")) {
      return;
    }

    setReward(value.trim());
  }, []);

  const handleOpenChange = useCallback(
    (newValue: boolean) => {
      if (newValue) {
        setOpen(true);
        return;
      }

      if (isLoading) {
        return;
      }

      setName("");
      setThumbnail("");
      setReward("");
      setDate(new Date());
      setOpen(false);
    },
    [isLoading],
  );

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !reward.trim()) {
      toast.error("Name and reward are required");
      return;
    }

    setIsLoading(true);
    await createShow({
      name: name.trim(),
      reward: Number(reward),
      thumbnailUrl: thumbnail.trim() ? thumbnail.trim() : undefined,
      date,
    });
    setIsLoading(false);
    handleOpenChange(false);
  }, [createShow, date, handleOpenChange, name, reward, thumbnail]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Show</DialogTitle>
          <DialogDescription>
            It can be an event, a pop-up. The reward represents the points that
            the user earns by being a part of the show. Thumbnail is optional.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center">
          <div className="w-40">
            <AspectRatio ratio={1} className="rounded-lg bg-muted">
              {thumbnail.trim() && (
                <img
                  src={thumbnail}
                  className="w-full h-full rounded-lg object-cover"
                  alt="Show thumbnail"
                />
              )}
            </AspectRatio>
          </div>

          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              disabled={isLoading}
              placeholder="Marginal gate 1"
              value={name}
              onChangeText={setName}
            />
          </Field>
          <Field>
            <FieldLabel>
              Thumbnail{" "}
              <span className="text-muted-foreground font-light">
                (optional)
              </span>
            </FieldLabel>
            <Input
              placeholder="https://..."
              value={thumbnail}
              onChangeText={setThumbnail}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel>Reward</FieldLabel>
            <Input
              placeholder="100"
              value={reward}
              onChangeText={handleRewardChange}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <DatePicker
              defaultValue={date}
              onDateChange={setDate}
              disabled={isLoading}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner /> : <Plus />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
