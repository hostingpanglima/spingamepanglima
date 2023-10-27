import TrpcProvider from "@/components/provider/TrpcProvider";
import { Toaster } from "@/components/ui/toaster";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: 'Mahkota69 LuckySpinner: Keseruan Tanpa Batas di Tangan Anda',
  description: 'Mahkota69 LuckySpinner: Putar, Menang, dan Raih Keberuntungan di Tangan Anda!',
}
const gameLayout = ({children}:PropsWithChildren) => {
  return (
    <TrpcProvider>
      {children}
      <Toaster />
    </TrpcProvider>
  );
}

export default gameLayout;