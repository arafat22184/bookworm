"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Library,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
    role: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const routes = [
    {
      label: "Home",
      icon: LayoutDashboard,
      href: user.role === "admin" ? "/admin/dashboard" : "/dashboard", // Adjust default home based on role
    },
    {
      label: "My Library",
      icon: Library,
      href: "/my-library",
      hidden: user.role === "admin", // Maybe admins also want to read? Let's keep it visible or hide strict.
    },
    {
      label: "Browse Books",
      icon: BookOpen,
      href: "/browse",
    },
    {
      label: "Tutorials",
      icon: GraduationCap,
      href: "/tutorials",
    },
    {
      label: "Profile",
      icon: Settings,
      href: "/profile",
    },
  ];

  const adminRoutes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
    },
    {
      label: "Manage Books",
      icon: BookOpen,
      href: "/admin/books",
    },
    {
      label: "Manage Users",
      icon: UserIcon,
      href: "/admin/users",
    },
    {
      label: "Manage Reviews",
      icon: MessageSquare,
      href: "/admin/reviews",
    },
    {
      label: "Manage Tutorials",
      icon: GraduationCap,
      href: "/admin/tutorials",
    },
    {
      label: "Profile",
      icon: Settings,
      href: "/profile",
    },
  ];

  const navRoutes = user.role === "admin" ? adminRoutes : routes;

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-2xl font-serif text-primary"
        >
          <BookOpen className="h-8 w-8" />
          <span>BookWorm</span>
        </Link>
      </div>
      <ScrollArea
        className="flex-1 px-4"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          {navRoutes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3",
                pathname === route.href && "bg-secondary/50"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="h-5 w-5" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t mt-auto">
        <Link href="/profile" className="block mb-4">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </Link>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
