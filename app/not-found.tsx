import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Home,
  LayoutDashboard,
  LogIn,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";

export default async function NotFound() {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="bg-muted/30 p-8 rounded-full mb-8 ring-1 ring-border">
        <BookOpen className="h-16 w-16 text-primary/80" />
      </div>

      <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-4">
        Page Not Found
      </h1>

      <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto font-serif italic">
        "It seems the chapter you are looking for has been torn out of our
        library."
      </p>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="min-w-[160px] gap-2"
        >
          <Link href="/">
            <Home className="h-4 w-4" />
            Return Home
          </Link>
        </Button>

        {user ? (
          <Button asChild size="lg" className="min-w-[160px] gap-2">
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          </Button>
        ) : (
          <Button asChild size="lg" className="min-w-[160px] gap-2">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        )}
      </div>

      <p className="mt-12 text-sm text-muted-foreground">Error Code: 404</p>
    </div>
  );
}
