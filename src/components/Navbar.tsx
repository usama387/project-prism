"use client";

import React from "react";
import Logo from "./Logo";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";

// child component of dashboard layout
const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
    </>
  );
};

// array of routes for the navbar
const items = [
  {
    id: 1,
    name: "Dashboard",
    link: "/",
  },
  {
    id: 2,
    name: "Transactions",
    link: "/transactions",
  },

  {
    id: 3,
    name: "Manage",
    link: "/manage",
  },
];

// Navbar for large screens
function DesktopNavbar() {
  return (
    <div className="hidden border-separate border-b bg-background md:block">
      <nav className="container flex items-center justify-between px-2">
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <Logo />
          <div className="flex h-full">
            {/* mapping items and sending as props to this child component */}
            {items?.map((item) => (
              <NavbarItem key={item.id} link={item.link} name={item.name} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

// function that accepts item as prop contains link and name
function NavbarItem({ link, name }: { link: string; name: string }) {
  // tracking user route
  const pathname = usePathname();

  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      {/* the link uses cn a merging utility for styling classes and ternary operator to determine current path */}
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          isActive && "text-foreground"
        )}
      >
        {name}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

export default Navbar;
