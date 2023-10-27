"use client"
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { TMisteriOption } from "@/lib/type/tmisteri";
import { HelpCircle, PartyPopper, Volume2, VolumeX, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Howl } from "howler";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import Confetti from "@/components/ui/confetti";
export type gameOption = {
  id: string
  category: string
  option: string
  x: number
  y: number
  c: number
  open: boolean
}
const MisteriBoxPage = () => {
  const isMobile = useMediaQuery(1024)
  const { data: data } = trpc.getMisteriboxOptionClient.useQuery(undefined, {onSuccess: (data)=>{setBox(data.option)}});
  const [box,setBox] = useState<gameOption[]>([])
  const [showPrice,setShowPrice] = useState(false)
  const [isStart,setIsStart] = useState(false)
  const [memberId,setMemberId] = useState('')
  const [codeVoucher,setCodeVoucher] = useState('')
  const [isAnimate,setIsAnimate] = useState(false)
  const [price,setPrice] = useState<TMisteriOption | null>(null)
  const [dialog,setDialog] = useState(false)
  const [showfinalprice,setShowfinalprice] = useState(false)
  const [muted,setMuted]= useState(false)
  const [bgSound, setBgSound] = useState<Howl>()
  const [couponId,setCouponId] = useState('')
  const animateTicket = ()=> {
    setIsAnimate(true)
    const animateInterval = setInterval(()=> {
      shuffle()
    },200)
    
    setTimeout(() => {
      clearInterval(animateInterval);
      setIsAnimate(false)
    }, 8000);
    // shuffle()
  }
  const getRandomNumber = (max:number) => {
    return  Math.floor(Math.random() * max)
  }
  const shuffle = ()=> {
    let boxwidth,boxheight,boxlength
    if(isMobile){
      boxwidth = 150
      boxheight = 98
      boxlength = 2
    }else{
      boxwidth = 270
      boxheight = 170
      boxlength = 4
    }

    const rnd = getRandomNumber(box.length)
    let rnd2
    do{
      rnd2 = getRandomNumber(box.length)
    }
    while(rnd === rnd2)

    const updatedItems = [...box]
    const pc = updatedItems[rnd].c
    const pc2 = updatedItems[rnd2].c
    updatedItems[rnd].x = ((box[rnd2].c % boxlength)-(rnd % boxlength))*boxwidth
    updatedItems[rnd2].x = ((box[rnd].c % boxlength)-(rnd2 % boxlength))*boxwidth
    updatedItems[rnd].y = (Math.floor(box[rnd2].c / boxlength) - Math.floor(rnd/boxlength)) * boxheight
    updatedItems[rnd2].y = (Math.floor(box[rnd].c / boxlength) - Math.floor(rnd2/boxlength)) * boxheight

    updatedItems[rnd].c = pc2 
    updatedItems[rnd2].c = pc
    setBox(updatedItems)
  }
  const handleOpen = (x: any)=> {
    if(!isAnimate && isStart){
      const updatedItems = [...box]
      const index = box.findIndex(item => item.id === x.id)
      updatedItems[index].category = price?.category || "uang"
      updatedItems[index].open = true
      setBox(updatedItems)
      setIsStart(false)
      setDialog(true)
      setShowfinalprice(true)
      updateCouponMB({id:couponId})
    }
  }
  const handleShowPrice = (e:boolean)=> {
    setShowfinalprice(false)
    if(!isStart){
      const updatedItems = [...box]
      updatedItems.map(item => item.open = e)
      setShowPrice(e)
      setBox(updatedItems)
    }
  }
  const handleOnClaim = () => {
    setShowfinalprice(false)
    handleShowPrice(false)
    if(!isStart){
      checkCoupon({memberId,codeVoucher})
    }
  }
  const { mutate: checkCoupon } = trpc.checkCouponMB.useMutation({
    onSuccess: ({ getData }) => {
      if (getData) {
        setIsStart(true)
        animateTicket()
        setPrice(getData.price)
        setCouponId(getData.id)
        setMemberId('')
        setCodeVoucher('')
      }
      else if (!getData) {
        toast({
          title: "Kode Voucher Tidak valid...",
          description: "Kode voucher tidak valid atau sudah terpakai.",
          variant: "destructive",
        });
        setIsStart(false)
      }
    },
  });
  const handleReset = ()=>{
    setDialog(false)
    setBox(JSON.parse(JSON.stringify(data?.option || [])))
  }
  useEffect(()=>{
    setBox(JSON.parse(JSON.stringify(data?.option || [])))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[isMobile])
  useEffect(()=>{
    const plays = ()=>{
      if(!bgSound){
        const tmp = new Howl({
          loop: true,
          src: ["./sound/mb.mp3"],
          rate: 1.0, // Initial rate
          autoplay: true,
        });
        setBgSound(tmp)
        setMuted(true)
      }
    }
    if(window)
      window.addEventListener("click",plays)
    return ()=> {
      window.removeEventListener("click",plays)
    }
  },[bgSound])
  const handlePlaysound = () => {
    if(bgSound){
      if(muted){
        bgSound.mute(true)
        setMuted(false)
      }else{
        bgSound.mute(false)
        setMuted(true)
      }
    }
  }
  const { mutate: updateCouponMB } = trpc.updateCouponMB.useMutation()
  return (
    <div className="flex justify-center items-center h-screen w-screen py-0 lg:py-10 bg-game2 bg-bottom bg-cover">
      {dialog && <div className="fixed inset-0 z-[1000] flex justify-center items-center">
        <div className="absolute bg-black inset-0 z-[1000] bg-opacity-70 backdrop-filter backdrop-blur-[3px] backdrop-brightness-10"></div>
        <Card className="relative px-10 py-14 z-[1001] text-center">
          <h1 className="text-2xl font-bold">Selamat Anda Memenangkan</h1>
          <p className="text-xl font-bold mt-5 flex items-center space-x-5 justify-center">
            <PartyPopper/>
            <span>{price?.option}</span>
            <PartyPopper/>
          </p>
          <p className="my-5">
            Silahkan claim hadiah anda di livechat kami!
          </p>
          <Link href="https://panglimaqq.bio/" target="_blank">
            <Button size="lg" className=" bg-gradient-to-tr from-[#08e1ae] to-[#98de5b] text-neutral-800 font-bold text-xl">
              Click here!
            </Button>
          </Link>
          <Button className="absolute top-2 right-3" size="sm" variant={"ghost"} onClick={handleReset}>
            <X size={20}></X>
          </Button>
        </Card>
      </div>}
      {dialog && <Confetti/>}
      <ScrollArea className="w-full max-h-full h-full max-w-6xl lg:rounded-md">
        <div className="flex w-full justify-between p-5 pb-0">
          <Button size="icon" onClick={handlePlaysound}>
            {muted?<VolumeX/>:<Volume2/>}
          </Button>
          <Button onClick={()=>handleShowPrice(!showPrice)}>Show Price</Button>
        </div>
        <div className="flex justify-center">
          <Image priority src="/logo.png" width={260} height={80} alt="logo" className="my-2"/>
        </div>
        <div className="grid grid-cols-[130px_130px] justify-center  lg:grid-cols-[250px_250px_250px_250px] gap-5 w-full">
         {box.map((item,index)=> (
          <div key={index} className="h-[78px] lg:h-[150px] relative cursor-pointer transition-transform duration-100" style={{transform: `translate(${item.x}px,${item.y}px)`}} onClick={()=>handleOpen(item)}>
            <Image src="/box/boxlg-2.png" priority fill sizes="(max-width: 1024px) 50vw, (min-width: 1024px) 100vw" alt="box" className="absolute bottom-0"/>
            <Image priority src={item.category ==="uang"?"/box/boxlg-3.png":item.category ==="emas"?"/box/boxlg-4.png":"/box/boxlg-5.png"} fill alt="isibox" className="absolute top-0" sizes="(min-width:300px) 100vw" style={{display: `${item.open?"block":"none"}`}}/>
            <Image priority src="/box/boxlg-1.png" fill alt="topbox" sizes="(min-width:300px) 100vw" className="absolute transition-[top]" style={{top: `${item.open?isMobile?-40:-60:0}px`}}/>
            {item.open && <div className="absolute inset-0 flex justify-center items-center z-50"><p className="text-white font-bold text-xl px-2 rounded-md bg-black/70">{showfinalprice?price?.option:item.option}</p></div>}
          </div>
         ))}
        </div>
        <div className="w-full mt-5 p-5 px-10 grid grid-cols-2 lg:grid-cols-3 items-center justify-center gap-3 lg:gap-10 flex-col dark text-white">
          <Input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="Member ID" className="h-14 text-lg"></Input>
          <Input value={codeVoucher} onChange={(e) => setCodeVoucher(e.target.value)} placeholder="Kode Voucher" className="h-14 text-lg"></Input>
          <Button onClick={handleOnClaim} className="w-full h-full col-span-2 lg:col-span-1 bg-gradient-to-tr from-[#08e1ae] to-[#98de5b] text-neutral-800 font-bold text-xl">CLAIM</Button>
        </div>
        
        <div className="flex items-center p-2 px-5 mx-10 rounded-md justify-center bg-white/70 font-medium text-lg text-green-800 space-x-2">
          <HelpCircle/>
          <span>{!isAnimate && isStart?"Silahkan Pilih Hadiah Anda":"Silahkan Masukan MemberID dan Kode voucher"} </span>
        </div>
      </ScrollArea>
    </div>
  );
}

export default MisteriBoxPage;