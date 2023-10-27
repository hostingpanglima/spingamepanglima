import { TMisteriOption } from "@/lib/type/tmisteri"
import {ColumnDef} from "@tanstack/react-table"

export const MisteriTableConfig:ColumnDef<TMisteriOption>[] = [
  {
    accessorKey: "option",
    header: "Option"
  },
  {
    accessorKey: "category",
    header: "Category"
  }
]