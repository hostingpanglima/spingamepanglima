import React from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { HexColorPicker } from "react-colorful";
import { Input } from "./input";
import { Pipette } from "lucide-react";
interface ColorpickerProps {
  value: string
  onChange: (...event: any[]) => void
  id?:string
  disabled?:boolean
}
const ColorPicker = React.forwardRef<HTMLButtonElement, ColorpickerProps>(
  ({ value,onChange,id,disabled=false}, ref) => {
  return (
    <div className="relative w-full">
      <Input value={value} onChange={onChange} className="pr-12"/>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            id={id}
            ref={ref}
            className={cn(
              "w-10 p-0 text-left font-normal absolute right-0 top-0",
              !value && "text-muted-foreground"
            )}
            style={{background: value}}
            disabled={disabled}
          >
            <Pipette className="h-4 w-4" size={24} strokeWidth={2}/>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* <SketchPicker color={value} onChangeComplete={handleChange}/> */}
          <HexColorPicker color={value} onChange={onChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
})
ColorPicker.displayName = "ColorPicker"

export default ColorPicker;