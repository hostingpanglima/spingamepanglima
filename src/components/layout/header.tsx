"use client"

import { Key, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { trpc } from "@/app/_trpc/client";
import { toast } from "../ui/use-toast";

interface HeaderProps {
  state: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
  }
  setDialog: Dispatch<SetStateAction<boolean>>
}

const Header = ({state,setDialog}:HeaderProps) => {
  return (
    <header className="h-[70px] flex items-center justify-between shadow-sm px-6 bg-white">
      <Button size="icon" variant="ghost" onClick={()=>{state.setIsOpen(old => !old)}}>
        <Menu size={24}/>
      </Button>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={18} className="p-3">
            <DropdownMenuItem onClick={()=>setDialog(true)}>
              <Key className="mr-2 h-4 w-4" />
              <span>Change Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={()=> signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
      </div>
    </header>
  );
}

export default Header;