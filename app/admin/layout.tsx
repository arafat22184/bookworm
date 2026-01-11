import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user || user.role !== 'admin') {
    redirect('/dashboard'); // Or 404/Login
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 border-r bg-background">
        <Sidebar user={user} /> 
      </div>
      <div className="md:pl-72 h-full">
        <Navbar user={user} />
        <main className="h-full p-8 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
