"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/logo/logo.png";
import { LayoutDashboard, Newspaper, Users, Settings, LogOut} from "lucide-react";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, useSidebar} from "@/components/ui/sidebar";


const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "News Management", href: "/news-management", icon: Newspaper },
  { title: "Users", href: "/users", icon: Users },
  { title: "Settings", href: "/settings", icon: Settings },
];


export default function AdminSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-0">
        {/* Logo area — same height as topbar (h-16) */}
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2.5 flex-1 min-w-0">
              <Image src={logo} alt="TuacasaAqui" width={32} height={32} className="shrink-0" />
              <span className="text-lg font-bold text-[#1b3a5c] truncate">
                TeuEmpregoAqui
              </span>
            </Link>
          )}
          <SidebarTrigger className="shrink-0 ml-auto bg-transparent border-0 shadow-none text-gray-500 hover:text-gray-700 hover:bg-transparent" />
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
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={
                      isActive
                        ? "bg-[#1b3a5c] text-white hover:bg-[#1b3a5c]/90 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5" />
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
              className="text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="size-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
