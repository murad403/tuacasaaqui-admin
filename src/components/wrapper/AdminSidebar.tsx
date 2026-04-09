"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import logo from "@/assets/logo/logo2.png";
import { LayoutDashboard, Newspaper, Users, Settings, LogOut, BookOpen, CircleQuestionMark, MessageSquare } from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useState } from "react";
import LogoutModal from "../modal/LogoutModal";


const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "News Management", href: "/news-management", icon: Newspaper },
  { title: "Guide", href: "/guide", icon: BookOpen },
  { title: "FAQ's", href: "/faq", icon: CircleQuestionMark },
  { title: "Feedback", href: "/feedback", icon: MessageSquare },
  { title: "Users", href: "/users", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];


export default function AdminSidebar() {

  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
  }>({ open: false });
  const pathname = usePathname();

  const handleLogout = () => {
    setDeleteModal({ open: true });
    // console.log("object")
  };

  const handleConfirmLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      router.replace("/auth/sign-in");
      router.refresh();
    }
  };

  return (
    <Sidebar collapsible="icon" className="bg-white">
      <SidebarHeader className="p-0">
        <div className="flex items-center justify-center border-b h-16 border-gray-200 group-data-[collapsible=icon]:px-0">
          <Link href="/" className="min-w-0 group-data-[collapsible=icon]:justify-center">
            <Image src={logo} alt="TuacasaAqui" width={500} height={500} className="shrink-0 object-contain group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 size-20" />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href} className="px-3 mt-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={` text-white
                    
                      ${isActive
                        ? "bg-linear-to-r from-button-start via-button-end to-button-start py-3 rounded-lg hover:text-white"
                        : "text-gray-600 hover:bg-gray-100  py-3"}
                    `}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-6" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign Out"
              onClick={handleLogout}
              className="text-red-500 bg-red-100 cursor-pointer px-4 rounded-lg transition-colors duration-300 hover:bg-red-50 hover:text-red-600 py-3"
            >
              <LogOut className="size-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <LogoutModal open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open })} onConfirm={handleConfirmLogout} />
    </Sidebar>
  );
}
