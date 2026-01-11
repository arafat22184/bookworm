import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Sidebar } from '@/components/shared/Sidebar';
import { Navbar } from '@/components/shared/Navbar';
import { clearAuthCookies } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Logout action for Client Component to call (via API or Server Action)
  // For now, simple API call from client.
  async function handleLogout() {
    'use server';
    // Actually we can't pass server action easily to client component prop if not defined properly.
    // We will let Sidebar use fetch('/api/auth/logout').
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-50 bg-gray-900">
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
