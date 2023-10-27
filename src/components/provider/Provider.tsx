"use client"

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import TrpcProvider from "./TrpcProvider";

interface ProviderProps extends PropsWithChildren {
}

const Provider = ({children}:ProviderProps) => {
  return (
    <SessionProvider>
      <TrpcProvider>
        {children}
      </TrpcProvider>
    </SessionProvider>
  );
}

export default Provider;