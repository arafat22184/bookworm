"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Navbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 w-full flex items-center p-4 border-b h-16 md:hidden bg-card">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-72"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {/* Close sheet on click by passing a wrapper or just relying on link clicks if we optimized Sidebar */}
          <Sidebar user={user} />
        </SheetContent>
      </Sheet>
      <div className="ml-4 font-serif text-xl font-bold">BookWorm</div>
    </div>
  );
}
