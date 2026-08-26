import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";

import Navbar from "../Navbar/Navbar";
import AppSidebar from "../AppSideabr/AppSidebar";
import { useAuth, useUser } from "@clerk/react";
import { useEffect } from "react";

const Layout = () => {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const role = user?.publicMetadata.role;
  const navigate = useNavigate();

  //   useEffect(() => {
  //     if (!isAuthLoaded || !isUserLoaded) return;
  //     if (!isSignedIn) {
  //       navigate("/signup");
  //     } else {
  //          if (role !== "admin") navigate("/noAuthorized");
  //     }
  //   }, [isSignedIn, role, isAuthLoaded, isUserLoaded, navigate]);
  if (!isAuthLoaded || !isUserLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        Downloading...
      </div>
    );
  }
  return (
    <SidebarProvider>
      <div className="flex h-dvh w-full overflow-hidden">
        <div className="w-64  h-full hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex flex-col flex-1 border  ">
          <div className=" h-16 ">
            <Navbar />
          </div>
          <div className="flex-1  p-4 overflow-y-auto  ">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
