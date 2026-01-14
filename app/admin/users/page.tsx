import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RoleSelect } from "@/components/admin/RoleSelect";
import { SerializedUser } from "@/lib/types";

const serialize = <T extends unknown>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

export default async function AdminUsersPage() {
  await connectToDatabase();

  const rawUsers = await User.find().sort({ createdAt: -1 });
  const users: SerializedUser[] = serialize(
    rawUsers
  ) as unknown as SerializedUser[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Manage Users</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: SerializedUser) => (
              <TableRow key={user._id}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.name}</span>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user.role === "admin" ? "destructive" : "secondary"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <RoleSelect userId={user._id} currentRole={user.role} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
