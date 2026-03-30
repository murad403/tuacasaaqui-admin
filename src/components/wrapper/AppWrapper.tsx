"use client"
import React from "react";
import AdminSidebar from "./AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AdminTopbar from "./AdminTopbar";
import { Provider } from "react-redux";
import store from "@/redux/store";


const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="flex flex-col min-w-0 overflow-x-hidden">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-6 bg-[#F8F9FB] overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Provider>
  );
};

export default AppWrapper;
