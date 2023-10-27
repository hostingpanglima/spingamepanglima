"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Wheels from "@/components/ui/wheels";
import { TSpiner, TSpinerOption } from "@/lib/type/tspiner";
import { useRef, useState } from "react";
import { trpc } from "../_trpc/client";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Confetti from "@/components/ui/confetti";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { PartyPopper, X } from "lucide-react";
import Link from "next/link";

const LuckySpinerPage = () => {
  const { data: data } = trpc.getLuckySpinerOptionClient.useQuery(undefined, {onSuccess: (data)=>{setListOption(data.option)}});
  const [listOption,setListOption] = useState<TSpinerOption[]>([])
  const [memberId,setMemberId] = useState('')
  const [codeVoucher,setCodeVoucher] = useState('')
  let coupon:TSpiner | undefined 
  const [isVisible, setIsVisible] = useState(false);
  const [dialog,setDialog] = useState(false)
  const [price,setPrice] = useState('')
  const startSpin = () => {
    setIsVisible(false)
    if(childRef.current)
      checkCoupon({memberId,codeVoucher})
  }
  const childRef = useRef<{ spin: (e?:number) => void } | null>(null);
  const { mutate: checkCoupon } = trpc.checkCoupon.useMutation({
    onSuccess: ({ getData }) => {
      if (getData) {
        console.log(getData)
        coupon = getData
        if(childRef.current){
          const winfromOption = listOption.findIndex(item => item.forceWin) === -1? undefined : listOption.findIndex(item => item.forceWin)
          const winfromCoupon = listOption.findIndex(item => item.id === getData.priceId) === -1? undefined : listOption.findIndex(item => item.id === getData.priceId)
          childRef.current.spin(winfromOption?winfromOption:winfromCoupon)
        }
      }
      if (!getData) {
        toast({
          title: "Kode Voucher Tidak valid...",
          description: "Kode voucher tidak valid atau sudah terpakai.",
          variant: "destructive",
        });
      }
    },
  });
  const { mutate: updateCoupon } = trpc.updateCoupon.useMutation()
  const onFinish = (result:string) => {
    if(coupon){
      const priceset = listOption.find(item => item.id == result)?.option || ""
      setIsVisible(true)
      toast({
        title: "Selamat Kamu Menang",
        description: `Hadiah kamu : ${priceset}`,
        variant: "success",
      });
      setPrice(priceset)
      setDialog(true)
      updateCoupon({id: coupon.id,price: result})
    }
  }
  const handleReset = ()=>{
    setMemberId('')
    setCodeVoucher('')
    setDialog(false)
  }
  return (
    <div className="flex items-center justify-center bg-game2 bg-bottom bg-cover h-screen flex-col overflow-hidden">
      {dialog && <div className="fixed inset-0 z-[1000] flex justify-center items-center">
        <div className="absolute bg-black inset-0 z-[1000] bg-opacity-70 backdrop-filter backdrop-blur-[3px] backdrop-brightness-10"></div>
        <Card className="relative px-10 py-14 z-[1001] text-center">
          <h1 className="text-2xl font-bold">Selamat Anda Memenangkan</h1>
          <p className="text-xl font-bold mt-5 flex items-center space-x-5 justify-center">
            <PartyPopper/>
            <span>{price}</span>
            <PartyPopper/>
          </p>
          <p className="my-5">
            Silahkan claim hadiah anda di livechat kami!
          </p>
          <Link href="https://kingmahkota.homes/" target="_blank">
            <Button size="lg" className=" bg-gradient-to-tr from-[#08e1ae] to-[#98de5b] text-neutral-800 font-bold text-xl">
              Click here!
            </Button>
          </Link>
          <Button className="absolute top-2 right-3" size="sm" variant={"ghost"} onClick={handleReset}>
            <X size={20}></X>
          </Button>
        </Card>
      </div>}
      <ScrollArea className="w-full max-h-full h-full p-2">
          <div className="flex justify-center">
            <Image priority src="/logo.png" width={260} height={80} alt="logo" className="my-2"/>
          </div>
          <div className="flex items-center justify-center flex-col p-5 pt-0">
            {listOption.length > 1 &&  <Wheels ref={childRef} segments={listOption} defaultSize={700} onFinish={onFinish}/>}
            <div className="w-full p-5 max-w-[500px] flex items-center justify-center gap-5 flex-col dark text-white">
              <Input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="Masukan Member ID" className="h-14 text-lg"></Input>
              <Input value={codeVoucher} onChange={(e) => setCodeVoucher(e.target.value)} placeholder="Masukan Kode Voucher" className="h-14 text-lg"></Input>
              <Button onClick={startSpin} className="w-56 bg-gradient-to-tr from-[#08e1ae] to-[#98de5b] text-white font-bold text-lg" size={"lg"}>SPIN</Button>
            </div>
          </div>
      </ScrollArea>
      {isVisible && <Confetti/>}
    </div>
  );
}

export default LuckySpinerPage;