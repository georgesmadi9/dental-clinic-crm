"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FancySelectOption {
  value: string;
  label: string;
}

interface FancySelectProps {
  options: FancySelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

export function FancySelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  isLoading,
  disabled,
}: FancySelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
          disabled={disabled}
        >
          {value ? (
            <span>
              {options.find((option) => option.value === value)?.label} {" "}
              <span className="font-bold italic">({value})</span>
            </span>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
      >
        <Command>
          <CommandInput placeholder="Search..." className="h-9" />
          <CommandList>
            {isLoading ? <></> : <CommandEmpty>No option found.</CommandEmpty>}
            <CommandGroup>
              {isLoading ? (
                <>
                  <span className="text-center">Loading...</span>
                </>
              ) : (
                options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <>
                      {option.label}{" "}
                      <span className="font-bold italic">({option.value})</span>
                    </>
                    <Check
                      className={cn(
                        "ml-auto",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
