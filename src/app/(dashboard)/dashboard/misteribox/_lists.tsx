"use client"
import { THeaderOption } from "@/components/page-container/defaultPageContainer";
import { Card } from "@/components/ui/card";
import { Menuicon } from "@/components/ui/menuIcon";
import TableData from "@/components/ui/table-data";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PenSquare, Trash2 } from "lucide-react";
import { TMisteri } from "@/lib/type/tmisteri";
import { MisteriTableConfig } from "./_config/misteriTableConfig";
interface MisteriListsProps {
  headerOption: THeaderOption
  data: {
    state: {
      searchFilter: string
      misteriLists: TMisteri[]
      currentPage: number
      totalData: number
      totalPage: number
    }
    setState: Dispatch<SetStateAction<{
      searchFilter: string
      misteriLists: TMisteri[]
      currentPage: number
      totalData: number
      totalPage: number
    }>>
  }
  selection: {
    rowSelection: {}
    setRowSelection: Dispatch<SetStateAction<{}>>
  },
  EventHandler: {
    handleEdit: ()=> void
    handleDelete: () => void
    updateTable: (e:boolean)=> void
  }
}

const MisteriLists = ({headerOption,data,selection,EventHandler}:MisteriListsProps) => {
  const isMobile = useMediaQuery(768)
  return (
    <>
      <Card>
        <div className="hidden h-20 items-center space-x-3 px-5 md:flex">
          <Menuicon name={headerOption.icon} />
          <h2 className="text-xl font-bold capitalize">
            {headerOption.title} Lists
          </h2>
        </div>
        <Card className="md:border-none md:bg-transparent md:shadow-none p-3">
          <div className="flex justify-between items-center flex-wrap mb-3">
            <Input icon="Search" placeholder="Search...." value={data.state.searchFilter} onChange={(e)=>data.setState((prevState) => ({ ...prevState, searchFilter: e.target.value }))} className="w-full sm:w-96"/>
            <div className={cn("w-full sm:w-auto mt-3 sm:mt-0 gap-3",isMobile?"grid grid-cols-2":"flex")}>
              <Button size="sm" variant="success" className={cn(Object.keys(selection.rowSelection).length === 1 ?"":"hidden","space-x-2")} onClick={EventHandler.handleEdit}>
                <PenSquare size={18}/>
                {isMobile?<span>EDIT</span>:null}
              </Button>
              <Button size="sm" variant="destructive" className={cn(Object.keys(selection.rowSelection).length > 0?"":"hidden","space-x-2")} onClick={EventHandler.handleDelete}>
                <Trash2 size={18}/>
                {isMobile?<span>DELETE</span>:null}
              </Button>
            </div>
          </div>
          <div>
            <TableData data={data.state.misteriLists || []} columns={MisteriTableConfig} selectable sorting selection={selection} />
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-muted-foreground">
              {data.state.currentPage === 0? 1 : (data.state.currentPage-1)*10+1}-{data.state.currentPage*10 > data.state.totalData ? data.state.totalData : data.state.currentPage*10} of {data.state.totalData}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button disabled={data.state.currentPage===1} onClick={()=> EventHandler.updateTable(false)} size="sm">
                Previous
              </Button>
              <Button disabled={data.state.totalPage === 0  || data.state.currentPage=== data.state.totalPage} onClick={()=> EventHandler.updateTable(true)} size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </Card>
    </>
  );
}

export default MisteriLists;