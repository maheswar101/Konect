import { ReactNode } from "react";
import BottomNav from "./BottomNav";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
