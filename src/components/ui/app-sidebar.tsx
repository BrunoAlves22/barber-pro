"use client";

import { Settings, Scissors, Notebook, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CustomTrigger } from "../CustomTrigger";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AppSidebar() {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      {state === "collapsed" && !isMobile && (
        <SidebarHeader className="bg-zinc-800 pt-5">
          <CustomTrigger />
        </SidebarHeader>
      )}
      <SidebarContent className="bg-zinc-800">
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <div className="flex items-center justify-between mt-5">
              <Link href="/dashboard" className="flex flex-row">
                <span className="font-semibold text-white whitespace-pre text-3xl">
                  Barber
                </span>
                <span className="font-semibold text-[#FBB131] whitespace-pre text-3xl">
                  Pro
                </span>
              </Link>

              <CustomTrigger />
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent
            className={cn(
              state === "collapsed" && "mt-2 px-0 py-0",
              state === "expanded" && "mt-5 px-4 py-3",
              isMobile && "mt-5 px-4 py-3"
            )}
          >
            <SidebarMenu className="flex gap-2.5">
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard"}
                    className={cn(
                      "text-white hover:bg-zinc-600 hover:text-white transition-colors duration-300 flex items-center",
                      state === "collapsed" && !isMobile && "justify-center"
                    )}
                  >
                    <Notebook size={20} />
                    <span
                      className={cn(
                        "font-medium",
                        !isMobile && state === "collapsed" && "hidden"
                      )}
                    >
                      Agenda
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/dashboard/haircuts">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/haircuts"}
                    className={cn(
                      "text-white hover:bg-zinc-600 hover:text-white transition-colors duration-300 flex items-center",
                      state === "collapsed" && !isMobile && "justify-center"
                    )}
                  >
                    <Scissors size={20} />
                    <span
                      className={cn(
                        "font-medium",
                        !isMobile && state === "collapsed" && "hidden"
                      )}
                    >
                      Cortes
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem className="">
                <Link href="/dashboard/profile">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/profile"}
                    className={cn(
                      "text-white hover:bg-zinc-600 hover:text-white transition-colors duration-300 flex items-center",
                      state === "collapsed" && !isMobile && "justify-center"
                    )}
                  >
                    <Settings size={20} />
                    <span
                      className={cn(
                        "font-medium",
                        !isMobile && state === "collapsed" && "hidden"
                      )}
                    >
                      Conta
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-zinc-800 pb-2">
        <SidebarMenu className="flex gap-2.5">
          <SidebarMenuItem>
            <SidebarMenuButton className="text-white hover:bg-zinc-600 hover:text-white transition-colors duration-300">
              <Link
                onClick={handleSignOut}
                href="/auth"
                className="flex flex-row items-center gap-2"
              >
                <LogOut size={20} className="" />
                <span className="font-medium">Sair</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
