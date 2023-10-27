"use client"
import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    darkmode?:boolean
    value:number
    onValueChange: (e:number)=>void
    currency?:boolean
}

export const formatCurrency = (value: number,currency:boolean) => {
  if(currency)
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  else
    return new Intl.NumberFormat('id-ID').format(value)
}

const InputNumber = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className,darkmode = true,value,onChange,onValueChange,currency=false, ...props}, ref) => {
    const formattedValue = formatCurrency(value,currency)

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const sanitizedValue = inputValue.replace(/[^\d]/g, '');
      onValueChange(parseInt(sanitizedValue, 10) || 0);
    };
    return (
      <input
        type={"text"}
        className={cn(
          "flex h-10 w-full rounded-md border border-input  px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          darkmode?"bg-background ring-offset-background":"bg-white",className
        )}
        value={formattedValue}
        onChange={handleInputChange}
        ref={ref}
        {...props}
      />
    )
  }
)
InputNumber.displayName = "InputNumber"

export default InputNumber