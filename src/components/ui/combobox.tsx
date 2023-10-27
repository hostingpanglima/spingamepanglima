"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"



interface ComboboxProps<T> {
  Lists: T []
  value?: string
  onChange: (e?:string) => void,
  name?: string
  disabled?:boolean
  id?:string
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps<any>>(
  ({ Lists,value,onChange,disabled=false,name="",id}, ref) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              id={id}
              ref={ref}
              className="w-full justify-between"
              disabled={disabled}
            >
              {
              value
                ? Lists.find((item) => item.id === value)?.option || "-"
                : `Select ${name}...`}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={`Select ${name}...`}/>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                      key={"null-item"}
                      onSelect={() => {
                        onChange(undefined)
                        setOpen(false)
                      }}
                >
                  <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "-" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    -
                </CommandItem>
                {Lists.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      onChange(item.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )
  }
)
Combobox.displayName = "Combobox"

export default Combobox
