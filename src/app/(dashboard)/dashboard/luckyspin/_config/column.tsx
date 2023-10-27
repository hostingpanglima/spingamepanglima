import { TMisteri } from "@/lib/type/tmisteri"
import { TSpinerOption } from "@/lib/type/tspiner"
import {ColumnDef} from "@tanstack/react-table"
import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"

export const SpinerOptionColumn:ColumnDef<TSpinerOption>[] = [
  {
    accessorKey: "option",
    header: "Option"
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({getValue}) => (
      <div className="flex">
        <span className="w-5 h-5 mr-1" style={{background: getValue() as string}}></span>
        {getValue() as string}
      </div>
    )
  },
  {
    accessorKey: "probability",
    header: "Probability",
    
  },
  {
    accessorKey: "forceWin",
    header: "Force Win",
    meta: {
      align:"center"
    },
    cell: ({getValue}) => (
      <div className="flex justify-center">{getValue()?<CheckCircle stroke="rgb(22 163 74)" />: <XCircle stroke="rgb(239 68 68)"/>}</div>
    )
  },
]