import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: 'Panglima79: Penjelajahan Misterius dalam Kotak Ajaib',
  description: 'Jelajahi Misteri dengan MisteriBox: Temukan Keajaiban di Setiap Kotak!',
}
const layout = ({children}:PropsWithChildren) => {
  return (
    <>
      {children}
    </>
  );
}

export default layout;