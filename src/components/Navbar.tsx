"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherButton } from "./ThemeSwitcherButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import Logo, { LogoMobile } from "./Logo";

// child component of dashboard layout
const Navbar = () => {
  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
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
function NavbarItem({
  link,
  name,
  clickCallback,
}: {
  link: string;
  name: string;
  clickCallback?: () => void;
}) {
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
        onClick={() => {
          if (clickCallback) clickCallback();
        }}
      >
        {name}
      </Link>
      {isActive && (
        <div className="absolute -bottom-[2px] left-1/2 h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}

function MobileNavbar() {
  // managing opening state of mobile navbar
  const [open, setOpen] = useState(false);

  // in this function for mobile navbar i am using shadcn ui Sheet , SheetTrigger and SheetContent to implement hamburger menu and then mapping the items once again sending as props to the NavbarItem to be displayed here

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        {/* Mobile Menu Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]" side="left">
            <Logo />
            <div className="flex flex-col gap-1 pt-4">
              {items.map((item) => (
                <NavbarItem
                  key={item.id}
                  link={item.link}
                  name={item.name}
                  clickCallback={() => setOpen(!open)}
                />
              ))}
            </div>
          </SheetContent>
        </Sheet>
        {/* Logo */}
        <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
          <LogoMobile />
        </div>
        {/* Dark Mode Switch and Clerk User Button */}
        <div className="flex items-center gap-2">
          <ThemeSwitcherButton />
          <UserButton afterSignOutUrl="/sign-in" />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
