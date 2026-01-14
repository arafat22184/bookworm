import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md border-zinc-200 dark:border-zinc-800 shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4 lg:hidden">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-serif text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Join BookWorm to track your reading journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
