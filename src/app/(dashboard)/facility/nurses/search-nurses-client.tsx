"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Star, MapPin, Briefcase, Award, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";

export function SearchNursesClient({ nurses }: { nurses: any[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);

  const filtered = nurses.filter((n) =>
    !search ||
    n.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    n.specializations?.some((s: string) => s.toLowerCase().includes(search.toLowerCase())) ||
    n.currentLocation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold">Search Nurses</h1>
        <p className="text-muted-foreground mt-1">{filtered.length} verified nurses available</p>
      </div>

      <Input
        placeholder="Search by name, specialization, or location..."
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-lg"
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((nurse, i) => (
          <motion.div key={nurse.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="card-hover cursor-pointer" onClick={() => setSelected(nurse)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                      {getInitials(nurse.user.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{nurse.user.name}</p>
                      {nurse.isAvailable && <Badge variant="success">Available</Badge>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{nurse.yearsOfExperience}y exp</span>
                      {nurse.rating > 0 && <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />{nurse.rating.toFixed(1)}</span>}
                      {nurse.currentLocation && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{nurse.currentLocation}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nurse.specializations.slice(0, 3).map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                      {nurse.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{nurse.specializations.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <Award className="h-3 w-3" />
                      {nurse.certifications.filter((c: any) => c.isVerified).length} verified cert(s)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No nurses found matching your criteria</p>
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-teal-100 text-teal-700 font-semibold">
                      {getInitials(selected.user.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selected.user.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">{selected.yearsOfExperience} years experience</p>
                  </div>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {selected.bio && <p className="text-sm text-muted-foreground">{selected.bio}</p>}
                <div>
                  <p className="text-sm font-semibold mb-2">Specializations</p>
                  <div className="flex flex-wrap gap-2">{selected.specializations.map((s: string) => <Badge key={s} variant="info">{s}</Badge>)}</div>
                </div>
                {selected.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Certifications</p>
                    <div className="space-y-1">
                      {selected.certifications.map((c: any) => (
                        <div key={c.name} className="flex items-center justify-between text-sm">
                          <span>{c.name}</span>
                          {c.isVerified && <Badge variant="success">Verified</Badge>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="w-full gap-2" asChild>
                  <a href={`mailto:${selected.user.email}`}><Mail className="h-4 w-4" />Contact Nurse</a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
