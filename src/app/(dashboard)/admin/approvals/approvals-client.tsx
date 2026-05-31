"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { formatDate, getInitials, timeAgo } from "@/lib/utils";
import { Check, X, User, Building2, Mail, Phone, ShieldCheck } from "lucide-react";

export function ApprovalsClient({ users: initialUsers }: { users: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(userId: string, status: "ACTIVE" | "REJECTED") {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        toast({
          title: status === "ACTIVE" ? "Account approved!" : "Account rejected",
          description: status === "ACTIVE" ? "User has been notified via email." : "User has been rejected.",
          variant: status === "ACTIVE" ? "success" : "default",
        });
      } else {
        const json = await res.json();
        toast({ title: "Error", description: json.error, variant: "destructive" });
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground mt-1">{users.length} account(s) awaiting review</p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-xl">
          <ShieldCheck className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="font-semibold text-lg">All caught up!</h3>
          <p className="text-muted-foreground mt-1">No pending approvals at this time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className={`text-white font-semibold ${user.role === "NURSE" ? "bg-teal-500" : "bg-brand-500"}`}>
                        {getInitials(user.name || user.email)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{user.name}</h3>
                        <Badge variant={user.role === "NURSE" ? "info" : "purple"}>{user.role}</Badge>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</p>
                        {user.phone && <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</p>}
                        {user.facilityProfile && (
                          <p className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{user.facilityProfile.facilityName} · {user.facilityProfile.facilityType}</p>
                        )}
                        {user.nurseProfile && (
                          <p className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{user.nurseProfile.yearsOfExperience} years experience · {user.nurseProfile.certifications.length} certifications</p>
                        )}
                        <p className="text-xs">Registered {timeAgo(user.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 border-red-200"
                        onClick={() => updateStatus(user.id, "REJECTED")}
                        loading={loading === user.id}
                      >
                        <X className="h-3.5 w-3.5 mr-1" />Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(user.id, "ACTIVE")}
                        loading={loading === user.id}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />Approve
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
