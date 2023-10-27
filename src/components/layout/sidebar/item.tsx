"use client";
import { Menuicon, TMenuiconname } from "@/components/ui/menuIcon";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebaritemProps {
  url: string;
  title: string;
  icon: TMenuiconname;
}
const SidebarItem = ({ url, title, icon }: SidebaritemProps) => {
  const pathname = usePathname();
  const isActive = pathname === url;
  return (
    <li>
      <Link href={url}>
        <div
          className={cn(
            "flex items-center space-x-3 whitespace-nowrap rounded-sm p-3",
            isActive
              ? "bg-blue-500 text-white"
              : "text-gray-900 hover:bg-blue-400/10  hover:text-blue-500",
          )}
        >
          <Menuicon name={icon} size={26} />
          <span className="">{title}</span>
        </div>
      </Link>
    </li>
  );
};

export default SidebarItem;
