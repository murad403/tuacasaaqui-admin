"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export default function AdminTopbar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-2 md:px-4 lg:px-6 border-b border-gray-200 bg-white">
      <SidebarTrigger className="-ml-1" />
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="size-5" />
          <span className="absolute -top-1 -right-1 size-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              Fernando
            </p>
          </div>
          <Link href="/settings/personal-information">
            <Avatar className="size-9 bg-[#1b3a5c]">
              <AvatarFallback className="bg-[#1b3a5c] text-white text-sm font-semibold">
                F
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
