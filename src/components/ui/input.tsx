import * as React from "react"

import { cn } from "@/lib/utils"
import { Menuicon, TMenuiconname } from "./menuIcon"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    darkmode?:boolean
    icon?: TMenuiconname
  }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type,darkmode = true,icon, ...props }, ref) => {
    return (
      <>
        {
          icon?
          <div className={cn("relative w-full",className)}>
            <span className="absolute left-3 top-1/2 -translate-y-1/2"><Menuicon name={icon} className="text-muted-foreground" size={16}/></span>
            <input
              type={type}
              className={cn(
                "flex h-10 w-full rounded-md border border-input pl-9 pr-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                darkmode?"bg-background ring-offset-background":"bg-white"
              )}
              ref={ref}
              {...props}
            />
          </div>
          :
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input  px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              darkmode?"bg-background ring-offset-background":"bg-white",className
            )}
            ref={ref}
            {...props}
          />
        }
      </>
      
    )
  }
)
Input.displayName = "Input"

export { Input }
