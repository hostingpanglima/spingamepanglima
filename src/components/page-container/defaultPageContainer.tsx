"use client"
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { ReactNode } from "react";
import { Menuicon, TMenuiconname } from "../ui/menuIcon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import { FileText, Table } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

export type THeaderOption = {
  icon: TMenuiconname,
  title: string
}

interface PageProps {
  headerOption: THeaderOption
  list: ReactNode
  form: ReactNode
  tabs: {
    tab: string
    setTab: (e:string) => void
  }
}
const DefaultPageContainer = ({list,form,tabs,headerOption}:PageProps) => {
  const isMobile = useMediaQuery(768)
  return (
    <>
      {isMobile?
      <Tabs value={tabs.tab} onValueChange={tabs.setTab} className="p-2">
        <Card className="flex px-5 h-20 items-center justify-between">
          <span className="flex items-center space-x-2 md:space-x-3">
            <Menuicon name={headerOption.icon}/>
            <h2 className="font-bold text-lg sm:text-xl capitalize">{headerOption.title} {tabs.tab}</h2>
          </span>
          <TabsList>
            <TabsTrigger value="form"><FileText size={16} className="mr-1"/> Form</TabsTrigger>
            <TabsTrigger value="list"><Table size={16} className="mr-1"/> Lists</TabsTrigger>
          </TabsList>
        </Card>
        <TabsContent value="form">
          <div className="h-[calc(100vh-174px)]">
            <ScrollArea className="h-full w-full rounded-lg">
              {form}
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="list">
        <div className="h-[calc(100vh-174px)]">
          <ScrollArea className="h-full w-full rounded-lg">
            <div className="grid grid-cols-1">
              {list}
            </div>
          </ScrollArea>
        </div>
        </TabsContent>
      </Tabs>
      :
      <div className="h-[calc(100vh-70px)]">
        <ScrollArea className="h-full w-full rounded-lg">
          <div className="grid grid-cols-2 gap-5 p-5">
            <div>
              {form}
            </div>
            <div>
              {list}
            </div>
          </div>
        </ScrollArea>
      </div>
      }
    </>
  );
}

export default DefaultPageContainer;