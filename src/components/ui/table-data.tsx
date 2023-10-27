"use client"

import { CheckedState } from "@radix-ui/react-checkbox";
import { CellContext, ColumnDef, HeaderContext, Row, RowData, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";
import { useCallback, useMemo} from "react";
import { ArrowDown, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface TableDataProps<TData,TValue> {
  data: TData[]
  columns: ColumnDef<TData,TValue>[]
  selectable?:boolean
  sorting?: boolean
  empty?: React.ReactNode
  selection:{
    rowSelection: any
    setRowSelection: (e:any) => void
  }
}

declare module '@tanstack/react-table' {
  // All declarations of 'ColumnMeta' must have identical type parameters
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    align?: 'left' | 'center' | 'right'
  }
}

function SelectionHeader<TData, TValue>({ table }: HeaderContext<TData, TValue>) {
  let checked: CheckedState = false
  const rows = table.getRowModel().flatRows
  const selectedRows = table.getSelectedRowModel().flatRows

  if (table.getIsAllRowsSelected()) checked = true
  else if (selectedRows.length > 0) checked = 'indeterminate'

  return (
    <Checkbox checked={checked} disabled={rows.length === 0} onCheckedChange={() => table.toggleAllRowsSelected()}  className="bg-white data-[state=checked]:bg-white data-[state=checked]:text-primary dark:data-[state=checked]:bg-white dark:data-[state=indeterminate]:bg-white dark:data-[state=indeterminate]:text-primary"/>
  )
}

function SelectionCell<TData, TValue>({ row }: CellContext<TData, TValue>) {
  return row.getCanSelect() ? (
    <div className="h-4">
      <Checkbox checked={row.getIsSelected()} onCheckedChange={row.getToggleSelectedHandler()} />
    </div>
  ) : (
    <Lock className="mt-1 p-[1px] w-[18px] h-[20px]" />
  )
}

const TableData = <TData extends { id?: string | number},TValue>({
  data,
  columns: userColumns,
  selectable,
  sorting=false,
  empty = "No Data Founded.",
  selection,
}:TableDataProps<TData,TValue>) => {
  const columns = useMemo(() => {
    if (selectable) {

      return [
        {
          id: 'selection',
          enableSorting: false,
          enableResizing: false,
          enableGlobalFilter: false,
          meta: { className: "w-[40px]" },
          header: SelectionHeader,
          cell: SelectionCell,
        },
        ...userColumns,] as ColumnDef<TData, TValue>[]
      }
      return userColumns
    }, [selectable, userColumns])
  const getRowId = useCallback((row: TData, index: number, parent?: Row<TData>) => {
    if (row.id) return row.id.toString()
    if (parent) return [parent.id, index].join('.')
    return index.toString()
  }, [])
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: selection.setRowSelection,
    state: {
      rowSelection: selection.rowSelection
    }
  })

  const handleRowClick = (row: Row<TData>,event: any): { row: Row<TData>,event: any } => {
    if(event.target.localName!="input")
        row.toggleSelected()
    return { row ,event};
  }
  return (
    <div className="relative w-full overflow-x-auto border rounded-md">
      <ScrollArea>
      <table className="w-full align-middle border-spacing-0 caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b bg-primary dark:bg-neutral-800 transition-colors data-[state=selected]:bg-muted">
              {headerGroup.headers.map((header)=> {
                const { meta = {} } = header.column.columnDef
                const { getCanSort, getToggleSortingHandler } = header.column
                const sort = sorting && getCanSort()
                const handler = getToggleSortingHandler()
                return(
                  <th key={header.id} className={cn("h-12 px-4 text-left whitespace-nowrap align-middle font-medium text-primary-foreground dark:text-muted-foreground ",meta.className)} style={{textAlign: meta.align}}>
                    {header.isPlaceholder?null:
                    <div className={cn(sort && "flex items-center gap-1 transition-colors cursor-pointer border-none rounded bg-none p-0 text-inherit select-none focus-visible:outline-0 focus-visible:shadow-sm hover:text-gray-300 dark:hover:text-gray-200",selectable && "h-4",sort && meta.align == "center" && "justify-center")}
                      onClick={handler} 
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault()
                          handler?.(e)
                        }
                      }}
                      role={sort ? 'button' : undefined}
                      tabIndex={sort ? 0 : undefined}
                    >
                      {flexRender(header.column.columnDef.header,header.getContext())}
                      {sort ? (
                        <ArrowDown
                          className="transition-transform w-[16px] h-[16px]"
                          style={{
                            opacity: header.column.getIsSorted() ? 1 : 0,
                            transform: header.column.getIsSorted() === 'asc' ? 'rotate(-180deg)' : undefined,
                          }}/>
                        ) : null
                      }
                    </div>
                    }
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody className="">
          {table.getRowModel().rows.map((row) => (
            <tr onClick={(event)=> handleRowClick(row,event)} key={row.id} className="border-b cursor-pointer transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              {row.getVisibleCells().map((cell) => {
                const { meta = {} } = cell.column.columnDef

                return (
                  <td className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", meta.className)} key={cell.id} style={{ textAlign: meta.align }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
        <tfoot className={"bg-primary font-medium text-primary-foreground"}>
        </tfoot>
      </table>
      </ScrollArea>
      {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full text-sm text-primary text-center" style={{ height: `44px` }}>
            {empty}
          </div>
        ) : null}
  </div>
  );
}

export default TableData