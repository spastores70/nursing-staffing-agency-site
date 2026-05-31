import Link from "next/link";
import { Heart } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-teal-50 flex flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg w-fit">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-teal-600">
            <Heart className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-gradient">NurseConnect</span>
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
      <footer className="p-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} NurseConnect · <Link href="/privacy" className="hover:underline">Privacy</Link> · <Link href="/terms" className="hover:underline">Terms</Link>
      </footer>
    </div>
  );
}
