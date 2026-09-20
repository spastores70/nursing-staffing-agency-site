import { Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur"><div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
    <a href="/" className="flex items-center gap-3" aria-label="NurseConnect home"><span className="grid size-10 place-items-center rounded-xl bg-[#0b3558] text-white shadow-sm"><Stethoscope className="size-5"/></span><span className="text-xl font-black tracking-[-0.04em]">Nurse<span className="text-[#047f83]">Connect</span></span></a>
    <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Main navigation"><a className="hover:text-slate-950" href="/jobs">Find jobs</a><a className="hover:text-slate-950" href="/facilities">For facilities</a><a className="hover:text-slate-950" href="/#how">How it works</a></nav>
    <div className="flex items-center gap-2"><Button asChild variant="ghost" className="hidden sm:inline-flex"><a href="/dashboard">Dashboard</a></Button><Button asChild className="h-11 rounded-xl bg-[#0b3558] px-5 hover:bg-[#082943]"><a href="/facilities">Post a shift</a></Button></div>
  </div></header>;
}
