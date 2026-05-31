"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatDate, getInitials, getStatusColor, timeAgo } from "@/lib/utils";
import { Search, MoreHorizontal, Shield, Ban, CheckCircle } from "lucide-react";

export function AdminUsersClient({ users: initialUsers }: { users: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesSearch = !search || u.email.toLowerCase().includes(search.toLowerCase()) || (u.name && u.name.toLowerCase().includes(search.toLowerCase()));
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  async function updateUserStatus(userId: string, status: string) {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, status } : u));
        toast({ title: "User status updated", variant: "success" });
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} of {users.length} users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Search by name or email..." leftIcon={<Search className="h-4 w-4" />} value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1" />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="NURSE">Nurse</SelectItem>
            <SelectItem value="FACILITY">Facility</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Login</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-brand-50 text-brand-700 text-xs">
                        {getInitials(user.name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={user.role === "ADMIN" ? "default" : user.role === "NURSE" ? "info" : "purple"}>
                    {user.role}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{formatDate(user.createdAt)}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{user.lastLoginAt ? timeAgo(user.lastLoginAt) : "Never"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {user.status !== "ACTIVE" && (
                      <Button size="sm" variant="ghost" className="h-7 text-green-600" onClick={() => updateUserStatus(user.id, "ACTIVE")} loading={loading === user.id}>
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {user.status !== "SUSPENDED" && user.role !== "ADMIN" && (
                      <Button size="sm" variant="ghost" className="h-7 text-red-600" onClick={() => updateUserStatus(user.id, "SUSPENDED")} loading={loading === user.id}>
                        <Ban className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users match your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
