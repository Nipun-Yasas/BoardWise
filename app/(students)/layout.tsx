"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../_components/Sidebar";
import { ThemeToggle } from "../_components/ThemeToggle";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  UserPen,
  HousePlus,
  User,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
  };

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserPen className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "My Boarding",
      href: "/boarding",
      icon: (
        <HousePlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "",
      icon: (
        <ArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: handleLogout,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden bg-background md:flex-row",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user?.name || "User",
                href: "/profile",
                icon: user?.image ? (
                  <Image
                    src={user.image}
                    className="h-7 w-7 shrink-0 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ) : (
                  <User className="h-7 w-7 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 flex-col overflow-y-auto h-full">
        {children}
      </div>
    </div>
  );
}
export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        BoardWise
      </motion.span>
    </div>
  );
};
export const LogoIcon = () => {
  return <ThemeToggle />;
};
