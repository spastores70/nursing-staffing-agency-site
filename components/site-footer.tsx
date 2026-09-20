import { Stethoscope } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#071f34] text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2"><div className="flex items-center gap-3 text-white"><span className="grid size-9 place-items-center rounded-xl bg-[#5fe0d5] text-[#071f34]"><Stethoscope className="size-5" /></span><span className="text-xl font-black">NurseConnect</span></div><p className="mt-4 max-w-md leading-7 text-blue-200">A clearer path between qualified nurses and the healthcare teams that need them.</p></div>
        <div><h2 className="font-bold text-white">Platform</h2><div className="mt-4 grid gap-3 text-sm"><a href="/jobs">Find jobs</a><a href="/facilities">Request staff</a><a href="/dashboard">Dashboard</a></div></div>
        <div><h2 className="font-bold text-white">Company</h2><div className="mt-4 grid gap-3 text-sm"><a href="/#how">How it works</a><a href="/privacy">Privacy</a><a href="mailto:hello@nurseconnect.health">Contact</a></div></div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-sm text-blue-300">© 2026 NurseConnect. Staffing decisions remain subject to facility verification and applicable law.</div>
    </footer>
  );
}
