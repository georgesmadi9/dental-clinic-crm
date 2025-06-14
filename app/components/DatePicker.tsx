"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePicker({
    name,
    value: propValue,
    onChange,
    disabled
}: {
    name: string;
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    disabled: boolean
}) {
    const [open, setOpen] = React.useState(false);

    // Use controlled value if provided, else internal state
    const [date, setDate] = React.useState<Date | undefined>(propValue ?? new Date());
    const [month, setMonth] = React.useState<Date | undefined>(date);
    const [inputValue, setInputValue] = React.useState(formatDate(date));

    // Sync internal state with propValue if controlled
    React.useEffect(() => {
        if (propValue !== undefined) {
            setDate(propValue);
            setMonth(propValue);
            setInputValue(formatDate(propValue));
        }
    }, [propValue]);

    const handleSelect = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setInputValue(formatDate(selectedDate));
        setOpen(false);
        if (onChange) {
            onChange(selectedDate);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <Label htmlFor="date" className="px-1">
                {name}
            </Label>
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={inputValue}
                    placeholder="June 01, 2025"
                    className="bg-background pr-10"
                    disabled={disabled}
                    onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setInputValue(e.target.value);
                        if (isValidDate(newDate)) {
                            setDate(newDate);
                            setMonth(newDate);
                            if (onChange) {
                                onChange(newDate);
                            }
                        } else if (onChange) {
                            onChange(undefined);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                            e.preventDefault();
                            setOpen(true);
                        }
                    }}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={handleSelect}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}
