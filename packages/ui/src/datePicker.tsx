import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useCallback } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover.tsx";
import { Button } from "#ui/button.tsx";
import { Calendar } from "#ui/calendar.tsx";

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  defaultValue?: Date;
  disabled?: boolean;
}

export function DatePicker({
  onDateChange,
  defaultValue,
  disabled,
}: DatePickerProps) {
  const [date, setDate] = React.useState(defaultValue);

  const handleDateChange = useCallback(
    (date: Date) => {
      setDate(date);
      onDateChange(date);
    },
    [onDateChange],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          defaultMonth={date}
          required
        />
      </PopoverContent>
    </Popover>
  );
}
