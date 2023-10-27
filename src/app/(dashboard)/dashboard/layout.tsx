import LayoutWrapper from "@/components/layout/layoutwrapper";
import Provider from "@/components/provider/Provider";
import { Toaster } from "@/components/ui/toaster";
import { PropsWithChildren } from "react";

const DashboardLayout = ({children}:PropsWithChildren) => {
  return (
    <Provider>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
      <Toaster />
    </Provider>
  );
}

export default DashboardLayout;