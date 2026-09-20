import { JobBrowser } from "@/components/job-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function JobsPage() { return <main className="min-h-screen bg-[#f4f8fb]"><SiteHeader/><JobBrowser/><SiteFooter/></main>; }
