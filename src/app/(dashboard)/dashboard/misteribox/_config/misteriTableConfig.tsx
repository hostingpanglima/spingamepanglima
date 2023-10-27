import { TMisteri } from "@/lib/type/tmisteri"
import {ColumnDef} from "@tanstack/react-table"
import { format } from "date-fns"
import { CheckCircle, XCircle } from "lucide-react"

export const MisteriTableConfig:ColumnDef<TMisteri>[] = [
  {
    accessorKey: "memberId",
    header: "Member ID"
  },
  {
    accessorKey: "codeVoucher",
    header: "Code Voucher"
  },
  {
    accessorKey: "price.option",
    header: "Price"
  },
  {
    accessorKey: "used",
    header: "Used",
    meta: {
      align:"center"
    },
    cell: ({getValue}) => (
      <div className="flex justify-center">{getValue()?<CheckCircle stroke="rgb(22 163 74)" />: <XCircle stroke="rgb(239 68 68)"/>}</div>
    )
  },
  {
    accessorKey: "canExpired",
    header: "Can Expired",
    meta: {
      align:"center"
    },
    cell: ({getValue}) => (
      <div className="flex justify-center">{getValue()?<CheckCircle stroke="rgb(22 163 74)" />: <XCircle stroke="rgb(239 68 68)"/>}</div>
    )
  },
  {
    accessorKey: "expiredDate",
    header: "Expired Date",
    cell: ({getValue}) => (
      <>{getValue() && getValue() !== "" ?format(new Date(getValue() as string), "PPP"): "-"}</>
    )
  },
  
]