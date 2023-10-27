import { CalendarIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";

interface DatepickerProps {
  value?: Date | null
  onChange: (...event: any[]) => void
  id?:string
  disabled?:boolean
}
const Datepicker = React.forwardRef<HTMLButtonElement, DatepickerProps>(
  ({ value,onChange,id,disabled=false}, ref) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          id={id}
          ref={ref}
          className={cn(
            "w-full pl-3 text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {value ? (
            format(new Date(value), "PPP")
          ) : (
            <span>Pick a date</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value === null ? undefined: value}
          onSelect={onChange}
          disabled={(date) =>
            date < new Date() 
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
    )
  }
)

Datepicker.displayName = "Datepicker"

export default Datepicker;