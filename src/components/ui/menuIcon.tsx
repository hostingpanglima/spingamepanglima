import { 
  Disc3,
  Gift,
  Search,
  LucideIcon,
  LucideProps,
} from "lucide-react"

interface ICONPROPS extends LucideProps{
  name?: keyof ICONBANK 
}
type ICONBANK = {
  Spin: LucideIcon
  Gift: LucideIcon
  Search: LucideIcon
}
const IconBank:ICONBANK = {
  Spin: Disc3,
  Gift,
  Search
}

export type TMenuiconname = keyof ICONBANK
export const Menuicon = ({name,size=20,...props}:ICONPROPS) => {
  if(!name)
      return <></>
  const LucideIcon = IconBank[name]
  return <LucideIcon {...props} width={size} height={size}/>
}