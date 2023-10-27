"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { VariantProps, cva } from "class-variance-authority"

const checkboxVariants = cva(
  "peer group h-5 w-5 shrink-0 rounded-sm dark:bg-neutral-700 dark:border-neutral-400 border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary dark:data-[state=checked]:bg-primary dark:data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground",
  {
    variants: {
      cbtype: {
        default: "",
        form: "block"
      }
    },
    defaultVariants:{
      cbtype: "default"
    }
  }
)

type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className,cbtype, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({cbtype,className}))}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-5 w-5 group-data-[state=indeterminate]:hidden" strokeWidth={4}/>
      <Minus className="h-5 w-5 hidden group-data-[state=indeterminate]:block" strokeWidth={4}/>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
