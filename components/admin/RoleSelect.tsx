'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function RoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const router = useRouter();

  const handleRoleChange = async (role: string) => {
    try {
        const res = await fetch(`/api/users/${userId}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role }),
        });
        if (!res.ok) throw new Error();
        toast.success("Role updated");
        router.refresh();
    } catch (_e) {
        toast.error("Failed to update role");
    } finally { };
  };

  return (
    <Select defaultValue={currentRole} onValueChange={handleRoleChange}>
      <SelectTrigger className="w-[100px] h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="user">User</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}
